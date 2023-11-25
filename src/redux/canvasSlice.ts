import { createSlice } from "@reduxjs/toolkit";
import { Canvas } from "../entities/Canvas";
export interface CanvasState extends Canvas {
  rendered: false;
  vpOriginX: number;
  vpOriginY: number;
  scale: number;
}

let initialState: CanvasState = {
  shapes: [],
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
  },
});

export const { shiftOriginX, changeScale, shiftOriginY, setRendered } =
  canvasSlice.actions;

export const { reducer: canvasReducer } = canvasSlice;
