import { createAction, createReducer } from "@reduxjs/toolkit";
import { Canvas, CanvasMode, Point, SolidShape } from "./types";
import { uniqueId } from "../../../utils/getRandomID";

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
  currentOrigin: { x: 0, y: 0 },
  isCtrlDown: false,
  isMouseDown: false,
  previousMouseDown: [],
};

// ------- ACTIONS ---------
let mouseDown = createAction<Point>("canvas/mouseDown");
let mouseUp = createAction<Point>("canvas/mouseUp");
let changeCanvasMode = createAction<CanvasMode>("canvas/changeCanvasMode");

// -------- REDUCER ----------
const canvasReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(mouseDown, (state, action) => {
      let mdPoint = action.payload;
      if (state.mode === CanvasMode.ShapeCreateP1) {
        state.previousMouseDown = [mdPoint];
        state.mode = CanvasMode.ShapeCreateP2;
        state.isMouseDown = true;
      }
    })
    .addCase(mouseUp, (state, action) => {
      let muPoint = action.payload;
      if (state.mode === CanvasMode.ShapeCreateP2) {
        let mdPoint = state.previousMouseDown[0];
        let newShape: SolidShape = {
          shapeTopLeftCoordinates: {
            x: Math.min(mdPoint.x, muPoint.x),
            y: Math.min(mdPoint.y, muPoint.y),
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
      }
    })
    .addCase(changeCanvasMode, (state, action) => {
      let newCanvasMode = action.payload;
      state.mode = newCanvasMode;
    });
});

export { canvasReducer, mouseDown, mouseUp, changeCanvasMode };
