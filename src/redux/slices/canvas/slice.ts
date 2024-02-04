import { createAction, createReducer } from "@reduxjs/toolkit";
import {
  Canvas,
  CanvasMode,
  FreeDrawnShape,
  MouseMoveData,
  Point,
  SolidShape,
} from "./types";
import { uniqueId } from "../../../utils/getRandomID";
import { getRealPoint } from "./utils";

let sampleShape1: SolidShape = {
  backgroundColor: "blue",
  backgroundFilled: false,
  shapeTopLeftCoordinates: { x: 500, y: 500 },
  id: "shape1",
  type: "rect",
  width: 400,
  height: 100,
  noteContents: "sample note",
  xAxisInclination: 0,
};

let initialState: Canvas = {
  id: "local_canvas_1",
  shapes: [sampleShape1],
  mode: CanvasMode.Default,
  toolbox: {
    selectedColor: "pink",
    selectedSolidShapeType: "rect",
  },
  zoom: 1.0,
  b: { x: 0, y: 0 },
  isCtrlDown: false,
  isMouseDown: false,
  isRightMouseDown: false,
  currFreeDrawPoints: [],
};

// ------- ACTIONS ---------
let mouseDown = createAction<Point>("canvas/mouseDown");
let rightMouseDown = createAction("canvas/rightMouseDown");
let rightMouseUp = createAction("canvas/rightMouseUp");
let mouseUp = createAction<Point>("canvas/mouseUp");
let mouseMove = createAction<MouseMoveData>("canvas/mouseMove");
let changeCanvasMode = createAction<CanvasMode>("canvas/changeCanvasMode");
let zoomCanvas = createAction<number>("canvas/zoomCanvas");

// -------- REDUCER ----------

// note: converting virtual points to real as soon as we get a click (i. e, in action.paylod itself)

const canvasReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(mouseDown, (state, action) => {
      let mdPoint = getRealPoint(state.b, action.payload, state.zoom);
      if (state.mode === CanvasMode.CreateShape) {
      } else if (state.mode === CanvasMode.FreeDraw) {
        state.currFreeDrawPoints = [mdPoint];
      }
      state.previousMouseDown = mdPoint;
      state.isMouseDown = true;
    })
    .addCase(mouseUp, (state, action) => {
      let muPoint = getRealPoint(state.b, action.payload, state.zoom);
      if (state.mode === CanvasMode.CreateShape) {
        let mdPoint = state.previousMouseDown!;
        let newShape: SolidShape = {
          shapeTopLeftCoordinates: {
            x: Math.min(mdPoint.x, muPoint.x),
            y: Math.max(mdPoint.y, muPoint.y),
          },
          xAxisInclination: 0,
          id: uniqueId(),
          type: state.toolbox.selectedSolidShapeType,
          backgroundColor: state.toolbox.selectedColor,
          width: Math.abs(mdPoint.x - muPoint.x),
          height: Math.abs(mdPoint.y - muPoint.y),
          noteContents: "",
          backgroundFilled: false,
        };
        state.shapes.push(newShape);
        state.mode = CanvasMode.Default;
      } else if (state.mode === CanvasMode.FreeDraw) {
        let newShape: FreeDrawnShape = {
          id: uniqueId(),
          realPoints: state.currFreeDrawPoints,
          strokeColor: state.toolbox.selectedColor,
          xAxisInclination: 0,
        };
        state.shapes.push(newShape);
        state.mode = CanvasMode.Default;
      }
      state.isMouseDown = false;
    })
    .addCase(rightMouseDown, (state) => {
      state.isRightMouseDown = true;
    })
    .addCase(rightMouseUp, (state) => {
      state.isRightMouseDown = false;
    })

    .addCase(changeCanvasMode, (state, action) => {
      let newCanvasMode = action.payload;
      state.mode = newCanvasMode;
    })
    .addCase(mouseMove, (state, action) => {
      let movData = action.payload;
      movData.deltaX /= state.zoom;
      movData.deltaY /= state.zoom;
      let pnt = getRealPoint(state.b, movData, state.zoom);
      movData.x = pnt.x;
      movData.y = pnt.y;
      if (state.mode === CanvasMode.Default && state.isRightMouseDown) {
        state.b.x -= movData.deltaX;
        state.b.y += movData.deltaY;
      } else if (state.mode === CanvasMode.FreeDraw && state.isMouseDown) {
        state.currFreeDrawPoints.push({ x: movData.x, y: movData.y });
      }
    })
    .addCase(zoomCanvas, (state, action) => {
      let delta = action.payload;
      state.zoom += delta;
    });
});

export {
  canvasReducer,
  mouseDown,
  mouseUp,
  changeCanvasMode,
  zoomCanvas,
  mouseMove,
  rightMouseUp,
  rightMouseDown,
};
