import { createAction, createReducer } from "@reduxjs/toolkit";
import {
  CanvasMode,
  FreeDrawnShape,
  MouseMoveData,
  VirtualPoint,
  SolidShape,
  Editor,
  ShapeModifierLocation,
  isSolidShape,
  RealPoint,
  WindowDimensions,
} from "./types";
import {
  getNewBoundaryPoints,
  getRealPoint,
  getRotatedBoundaryPoints,
  getSelectedShapeID,
  getTopLeftPointAndWidthAndHeight,
  rotateCoordinates,
} from "./utils";
import { uid } from "uid";
import { shallowEquals } from "../../../utils/shallowEquals";
import { WritableDraft } from "immer/dist/internal.js";
let toID = uid;
let sampleShape1: SolidShape = {
  backgroundColor: "blue",
  borderColor: "#00000000",
  shapeTopLeftCoordinates: { realX: 500, realY: 500 },
  id: "shape1",
  type: "rect",
  width: 400,
  height: 100,
  noteContents: "sample note",
  xAxisInclination: 0,
};

let initialState: Editor = {
  toolbox: {
    selectedSolidShapeType: "rect",
  },
  canvas: {
    id: "local_canvas_1",
    shapes: [sampleShape1],
    mode: CanvasMode.Default,
    height: 0,
    width: 0,

    zoom: 1.0,
    b: { realX: 0, realY: 0 },

    currFreeDrawPoints: [],
    arrows: [],
  },
  keyState: {
    isCtrlDown: false,
    isMouseDown: false,
    isRightMouseDown: false,
  },
};

// ------- ACTIONS ---------
let mouseDown = createAction<VirtualPoint>("canvas/mouseDown");
let rightMouseDown = createAction("canvas/rightMouseDown");
let rightMouseUp = createAction("canvas/rightMouseUp");
let mouseUp = createAction<VirtualPoint>("canvas/mouseUp");
let mouseMove = createAction<MouseMoveData>("canvas/mouseMove");
let changeCanvasMode = createAction<CanvasMode>("canvas/changeCanvasMode");
let zoomCanvas = createAction<number>("canvas/zoomCanvas");
let shapeModifierClick = createAction<ShapeModifierLocation>(
  "canvas/shapeModifierClick"
);
// the payload is angle in degrees
let rotateShapeTextFieldEnter = createAction<number>(
  "canvas/rotateShapeTextFieldEnter"
);
let noteTextFieldEnter = createAction<string>("canvas/noteTextFieldEnter");
let windowResize = createAction<WindowDimensions>("canvas/windowResize");
let windowSetup = createAction<WindowDimensions>("canvas/windowSetup");

// -------- REDUCER ----------

// note: converting virtual points to real as soon as we get a click (i. e, in action.paylod itself)

const editorReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(mouseDown, (state, action) => {
      let mdPoint = getRealPoint(
        state.canvas.b,
        action.payload,
        state.canvas.zoom
      );
      switch (state.canvas.mode) {
        case CanvasMode.CreateShape:
          break;
        case CanvasMode.FreeDraw:
          state.canvas.currFreeDrawPoints = [mdPoint];
          break;
        case CanvasMode.Default: {
          let selectedShapeID = getSelectedShapeID(
            mdPoint,
            state.canvas.shapes
          );
          if (selectedShapeID !== "") {
            state.canvas.mode = CanvasMode.ShapeModify;
            state.canvas.singleSelectShapeID = selectedShapeID;
          }
          break;
        }
        case CanvasMode.ShapeModify: {
          let selectedShapeID = getSelectedShapeID(
            mdPoint,
            state.canvas.shapes
          );
          if (selectedShapeID === "") {
            state.canvas.mode = CanvasMode.Default;
          } else if (selectedShapeID === state.canvas.singleSelectShapeID) {
            // dragging the shape
            state.canvas.activeShapeModifierLocation =
              ShapeModifierLocation.inside;
          }

          state.canvas.singleSelectShapeID = selectedShapeID;

          break;
        }
      }

      state.keyState.previousMouseDown = mdPoint;
      state.keyState.isMouseDown = true;
    })
    .addCase(mouseUp, (state, action) => {
      let muPoint = getRealPoint(
        state.canvas.b,
        action.payload,
        state.canvas.zoom
      );

      if (state.canvas.mode === CanvasMode.CreateShape) {
        let mdPoint = state.keyState.previousMouseDown!;
        let newShape: SolidShape = {
          shapeTopLeftCoordinates: {
            realX: Math.min(mdPoint.realX, muPoint.realX),
            realY: Math.max(mdPoint.realY, muPoint.realY),
          },
          xAxisInclination: 0,
          id: toID(),
          type: state.toolbox.selectedSolidShapeType,
          backgroundColor: "#00000000",
          borderColor: "#ff000000",
          width: Math.abs(mdPoint.realX - muPoint.realX),
          height: Math.abs(mdPoint.realY - muPoint.realY),
          noteContents: "",
        };
        state.canvas.shapes.push(newShape);
        state.canvas.mode = CanvasMode.ShapeModify;
        state.canvas.singleSelectShapeID = newShape.id;
      } else if (state.canvas.mode === CanvasMode.FreeDraw) {
        // mousemove may not register the last co-ordinate

        let recentlyInsertedPoint =
          state.canvas.currFreeDrawPoints[
            state.canvas.currFreeDrawPoints.length - 1
          ];

        if (!shallowEquals(recentlyInsertedPoint, muPoint)) {
          state.canvas.currFreeDrawPoints.push(muPoint);
        }

        let newShape: FreeDrawnShape = {
          id: toID(),
          points: state.canvas.currFreeDrawPoints,
          strokeColor: "#00000000",
          xAxisInclination: 0,
        };
        state.canvas.shapes.push(newShape);
        state.canvas.mode = CanvasMode.ShapeModify;
        state.canvas.currFreeDrawPoints = [];
        state.canvas.singleSelectShapeID = newShape.id;
      } else if (state.canvas.mode === CanvasMode.ShapeModify) {
        state.canvas.activeShapeModifierLocation = undefined;
      } else if (state.canvas.mode === CanvasMode.DrawArrow) {
        let mdPoint = state.keyState.previousMouseDown!;
        let shape1ID = getSelectedShapeID(mdPoint, state.canvas.shapes);
        if (shape1ID !== "") {
          let shape2ID = getSelectedShapeID(muPoint, state.canvas.shapes);
          if (shape2ID !== "") {
            state.canvas.arrows.push({
              fromShapeID: shape1ID,
              toShapeID: shape2ID,
            });
          }
        }
      }
      state.keyState.isMouseDown = false;
    })
    .addCase(rightMouseDown, (state) => {
      state.keyState.isRightMouseDown = true;
    })
    .addCase(rightMouseUp, (state) => {
      state.keyState.isRightMouseDown = false;
    })

    .addCase(changeCanvasMode, (state, action) => {
      let newCanvasMode = action.payload;
      if (newCanvasMode === CanvasMode.Default) {
        state.canvas.singleSelectShapeID = "";
      }
      state.canvas.mode = newCanvasMode;
    })
    .addCase(mouseMove, (state, action) => {
      let movData = action.payload;
      movData.deltaX /= state.canvas.zoom;
      movData.deltaY /= state.canvas.zoom;
      let pnt = getRealPoint(state.canvas.b, movData, state.canvas.zoom);
      if (
        state.canvas.mode === CanvasMode.Default &&
        state.keyState.isRightMouseDown
      ) {
        state.canvas.b.realX -= movData.deltaX;
        state.canvas.b.realY += movData.deltaY;
      } else if (
        state.canvas.mode === CanvasMode.FreeDraw &&
        state.keyState.isMouseDown
      ) {
        state.canvas.currFreeDrawPoints.push({
          realX: pnt.realX,
          realY: pnt.realY,
        });
      } else if (
        state.canvas.mode === CanvasMode.ShapeModify &&
        state.keyState.isMouseDown &&
        state.canvas.activeShapeModifierLocation !== undefined &&
        state.canvas.activeShapeModifierLocation !==
          ShapeModifierLocation.inside
      ) {
        let selectedShape = state.canvas.shapes.find(
          (shape) => shape.id === state.canvas.singleSelectShapeID
        );
        if (selectedShape === undefined) {
          throw new Error("shape not found, shouldn't occur");
        }

        let newWidth: number;
        let newHeight: number;
        let newTopLeftCoordinates: RealPoint;
        let newXAxisInclination: number;

        let oldTopLeftPoint: WritableDraft<RealPoint>;
        let oldWidth: number;
        let oldHeight: number;
        let oldXAxisInclination: number;
        if (isSolidShape(selectedShape)) {
          oldTopLeftPoint = selectedShape.shapeTopLeftCoordinates;
          oldHeight = selectedShape.height;
          oldWidth = selectedShape.width;
          oldXAxisInclination = selectedShape.xAxisInclination;
        } else {
          oldTopLeftPoint = {
            realX: Math.min(
              ...selectedShape.points.map((point) => point.realX)
            ),
            realY: Math.max(
              ...selectedShape.points.map((point) => point.realY)
            ),
          };

          let oldXs = selectedShape.points.map((point) => point.realX);
          let oldYs = selectedShape.points.map((point) => point.realY);

          oldWidth = Math.max(...oldXs) - Math.min(...oldXs);
          oldHeight = Math.max(...oldYs) - Math.min(...oldYs);
          oldXAxisInclination = selectedShape.xAxisInclination;
        }

        if (selectedShape.xAxisInclination !== 0) {
          let newBoundaryPoints = getNewBoundaryPoints(
            getRotatedBoundaryPoints(
              oldTopLeftPoint,
              oldWidth,
              oldHeight,
              oldXAxisInclination
            ),
            state.canvas.activeShapeModifierLocation,
            pnt
          );
          ({
            topLeft: newTopLeftCoordinates,
            width: newWidth,
            height: newHeight,
            xAxisInclination: newXAxisInclination,
          } = getTopLeftPointAndWidthAndHeight(newBoundaryPoints));
        } else {
          let point1;
          let point2;
          let rotatedPnt = rotateCoordinates(
            oldTopLeftPoint,
            pnt,
            selectedShape.xAxisInclination,
            true
          );
          switch (state.canvas.activeShapeModifierLocation) {
            case ShapeModifierLocation.tl: {
              point1 = rotatedPnt;
              point2 = {
                realX: oldTopLeftPoint.realX + oldWidth,
                realY: oldTopLeftPoint.realY - oldHeight,
              };
              break;
            }
            case ShapeModifierLocation.br: {
              point1 = rotatedPnt;
              point2 = oldTopLeftPoint;
              break;
            }
            case ShapeModifierLocation.bl: {
              point1 = rotatedPnt;
              point2 = {
                realX: oldTopLeftPoint.realX + oldWidth,
                realY: oldTopLeftPoint.realY,
              };
              break;
            }
            case ShapeModifierLocation.tr: {
              point1 = rotatedPnt;
              point2 = {
                realX: oldTopLeftPoint.realX,
                realY: oldTopLeftPoint.realY - oldHeight,
              };
            }
          }

          newWidth = Math.abs(point2.realX - point1.realX);
          newHeight = Math.abs(point2.realY - point1.realY);
          newTopLeftCoordinates = {
            realX: Math.min(point1.realX, point2.realX),
            realY: Math.max(point1.realY, point2.realY),
          };
          newXAxisInclination = 0;
        }

        if (isSolidShape(selectedShape)) {
          selectedShape.width = newWidth;
          selectedShape.height = newHeight;
          selectedShape.shapeTopLeftCoordinates = newTopLeftCoordinates;
          selectedShape.xAxisInclination = newXAxisInclination;
        } else {
          // co-ordinates relative to the top left point(just subtracting) before the shape was modified

          let oldDistancesFromTopLeft = selectedShape.points.map((point) => ({
            xDist: -oldTopLeftPoint.realX + point.realX,
            yDist: -point.realY + oldTopLeftPoint.realY,
          }));

          let xMultiplier = newWidth / oldWidth;
          let yMultiplier = newHeight / oldHeight;

          let newDistancesFromTopLeft = oldDistancesFromTopLeft.map((dist) => ({
            xDist: dist.xDist * xMultiplier,
            yDist: dist.yDist * yMultiplier,
          }));

          let newPoints = newDistancesFromTopLeft.map((dist) => ({
            realX: newTopLeftCoordinates.realX + dist.xDist,
            realY: newTopLeftCoordinates.realY - dist.yDist,
          }));

          selectedShape.points = newPoints;
        }
      } else if (
        state.canvas.mode === CanvasMode.ShapeModify &&
        state.keyState.isMouseDown &&
        state.canvas.activeShapeModifierLocation ===
          ShapeModifierLocation.inside
      ) {
        let selectedShape = state.canvas.shapes.find(
          (shape) => shape.id === state.canvas.singleSelectShapeID
        );
        if (selectedShape === undefined) {
          throw new Error("shape not found, shouldn't occur");
        }
        if (isSolidShape(selectedShape)) {
          selectedShape.shapeTopLeftCoordinates = {
            realX: selectedShape.shapeTopLeftCoordinates.realX + movData.deltaX,
            realY: selectedShape.shapeTopLeftCoordinates.realY + movData.deltaY,
          };
        } else {
          selectedShape.points.forEach((point) => {
            point.realX += movData.deltaX;
            point.realY += movData.deltaY;
          });
        }
      }
    })
    .addCase(zoomCanvas, (state, action) => {
      let delta = action.payload;
      state.canvas.zoom += delta;
    })
    .addCase(shapeModifierClick, (state, action) => {
      let clickedLocation = action.payload;
      state.canvas.activeShapeModifierLocation = clickedLocation;
      state.keyState.isMouseDown = true;
    })
    .addCase(rotateShapeTextFieldEnter, (state, action) => {
      let selectedShape = state.canvas.shapes.find(
        (e) => e.id === state.canvas.singleSelectShapeID
      );

      if (selectedShape === undefined) {
        throw new Error("didn't find any shape selected, shouldn't occur");
      }

      let newAngleInDegrees = action.payload;

      let newAngleInRadians = (Math.PI * newAngleInDegrees) / 180;

      selectedShape.xAxisInclination = newAngleInRadians;
    })
    .addCase(noteTextFieldEnter, (state, action) => {
      let newNote = action.payload;
      let selectedShape = state.canvas.shapes.find(
        (shape) => shape.id === state.canvas.singleSelectShapeID
      ) as SolidShape;
      selectedShape.noteContents = newNote;
    })
    .addCase(windowResize, (state, action) => {
      let newDimensions = action.payload;
      state.canvas.width = newDimensions.width;
      state.canvas.height = newDimensions.height;
    })
    .addCase(windowSetup, (state, action) => {
      let newDimensions = action.payload;
      state.canvas.width = newDimensions.width;
      state.canvas.height = newDimensions.height;
    });
});

export {
  editorReducer,
  mouseDown,
  mouseUp,
  changeCanvasMode,
  zoomCanvas,
  mouseMove,
  rightMouseUp,
  rightMouseDown,
  shapeModifierClick,
  rotateShapeTextFieldEnter,
  windowResize,
  windowSetup,
};
