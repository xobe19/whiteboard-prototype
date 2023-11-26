import { createSlice } from "@reduxjs/toolkit";
import { Canvas, toRealX, toRealY } from "../entities/Canvas";
import { convertVirtualPointsToReal } from "../utils/canvas/convertVirtualPointsToReal";
export interface CanvasState extends Canvas {
  rendered: false;
  vpOriginX: number;
  vpOriginY: number;
  scale: number;
}

let initialState: CanvasState = {
  shapes: [
    {
      backgroundColor: "blue",
      height: 100,
      width: 400,
      noteSafeHeight: 300,
      noteSafeWidth: 300,
      noteSafeX: 500,
      noteSafeY: 500,
      x: 500,
      y: 500,
      type: "rect",
      rotatedRadians: 0,
      points: [],
    },
  ],
  scale: 1.0,
  vpOriginX: 0,
  vpOriginY: 0,
  rendered: false,
};

export const canvasSlice = createSlice({
  name: "canvas",
  initialState,
  reducers: {
    shiftOriginX: (state, action) => {
      let deltaX = action.payload;
      state.vpOriginX -= deltaX;
      state.rendered = false;
    },
    shiftOriginY: (state, action) => {
      let deltaY = action.payload;
      state.vpOriginY -= deltaY;
      state.rendered = false;
    },
    changeScale: (state, action) => {
      let deltaScale = action.payload;
      state.scale -= deltaScale;
      state.rendered = false;
    },
    setRendered: (state, action) => {
      let newRendered = action.payload;
      state.rendered = newRendered;
    },
    addShape: (state, action) => {
      let shape = action.payload;
      let shapeNew: Shape = {
        ...shape,
        x: toRealX(shape.x, state.vpOriginX, state.scale),
        y: toRealY(shape.y, state.vpOriginY, state.scale),
        width: shape.width / state.scale,
        height: shape.height / state.scale,
        noteSafeX: toRealX(shape.noteSafeX, state.vpOriginX, state.scale),
        noteSafeY: toRealY(shape.noteSafeY, state.vpOriginY, state.scale),
        noteSafeHeight: shape.noteSafeHeight / state.scale,
        noteSafeWidth: shape.noteSafeWidth / state.scale,
      };

      convertVirtualPointsToReal(shapeNew, shape, state);

      state.shapes.push(shapeNew);
    },
  },
});

export const {
  shiftOriginX,
  changeScale,
  shiftOriginY,
  setRendered,
  addShape,
} = canvasSlice.actions;

export const { reducer: canvasReducer } = canvasSlice;


