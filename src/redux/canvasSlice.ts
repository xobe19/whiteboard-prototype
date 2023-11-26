import { createSlice } from "@reduxjs/toolkit";
import { Canvas } from "../entities/Canvas";
export interface CanvasState extends Canvas {
  rendered: false;
  vpOriginX: number;
  vpOriginY: number;
  scale: number;
  mode: "drawing" | "creatingShape" | "select" | "dragging" | "rotating"
}

let initialState: CanvasState = {
  shapes: [{backgroundColor: "blue", height: 100, width: 400, id: "whwatever", noteSafeHeight: 300, noteSafeWidth: 300, noteSafeX: 500, noteSafeY: 500, x: 500, y: 500, type: "rect", rotatedRadians: 0}],
  scale: 1.0,
  vpOriginX: 0,
  vpOriginY: 0,
  rendered: false,
  mode: "drawing"

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
  },
});

export const { shiftOriginX, changeScale, shiftOriginY, setRendered } =
  canvasSlice.actions;

export const { reducer: canvasReducer } = canvasSlice;
