import { createAction, createReducer, createSlice } from "@reduxjs/toolkit";
import { Canvas, CanvasMode, Point, SolidShape } from "./types";

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
  zoom: 1.0,
  currentOrigin: { x: 0, y: 0 },
  isCtrlDown: false,
  isMouseDown: false,
  previousMouseDown: [],
};

let mouseDown = createAction<Point>("canvas/mouseDown");

const canvasReducer = createReducer(initialState, (builder) => {
  builder.addCase(mouseDown, (state, action) => {
    if (state.mode == CanvasMode.ShapeCreate) {
    }
  });
});

export { canvasReducer };
