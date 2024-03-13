import { createAction, createReducer } from "@reduxjs/toolkit";
import {
  CanvasMode,
  FreeDrawnShape,
  MouseMoveData,
  VirtualPoint,
  SolidShape,
  Editor,
} from "./types";
import { getRealPoint, getSelectedShapeID } from "./utils";
import { uid } from "uid";
import { shallowEquals } from "../../../utils/shallowEquals";
let toID = uid;
let sampleShape1: SolidShape = {
  backgroundColor: "blue",
  backgroundFilled: false,
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
    selectedColor: "pink",
    selectedSolidShapeType: "rect",
  },
  canvas: {
    id: "local_canvas_1",
    shapes: [sampleShape1],
    mode: CanvasMode.Default,

    zoom: 1.0,
    b: { realX: 0, realY: 0 },

    currFreeDrawPoints: [],
    multiSelectShapeID: [],
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
        case CanvasMode.Default:
          let selectedShapeID = getSelectedShapeID(
            mdPoint,
            state.canvas.shapes
          );
          if (selectedShapeID !== "") {
            state.canvas.mode = CanvasMode.ShapeModify;
            state.canvas.singleSelectShapeID = selectedShapeID;
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
          backgroundColor: state.toolbox.selectedColor,
          width: Math.abs(mdPoint.realX - muPoint.realX),
          height: Math.abs(mdPoint.realY - muPoint.realY),
          noteContents: "",
          backgroundFilled: false,
        };
        state.canvas.shapes.push(newShape);
        state.canvas.mode = CanvasMode.Default;
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
          strokeColor: state.toolbox.selectedColor,
          xAxisInclination: 0,
        };
        state.canvas.shapes.push(newShape);
        state.canvas.mode = CanvasMode.Default;
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
      }
    })
    .addCase(zoomCanvas, (state, action) => {
      let delta = action.payload;
      state.canvas.zoom += delta;
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
};
