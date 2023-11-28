import { createSlice } from "@reduxjs/toolkit";
import { toRealX, toRealY, toVirtualX, toVirtualY } from "../entities/Canvas";
import { convertVirtualPointsToReal } from "../utils/canvas/convertVirtualPointsToReal";
import { Point } from "../entities/Point";
import { Shape } from "../entities/Shape";
import { isPointInBox } from "../utils/canvas/isPointInBox";
import { CanvasState } from "./types";
import { rotateCoordinates } from "../utils/canvas/rotateCoordinates";

let initialState: CanvasState = {
  shapes: [
    {
      backgroundColor: "blue",
      height: 100,
      width: 400,
      noteSafeHeight: 50,
      noteSafeWidth: 200,
      noteSafeX: 500,
      noteSafeY: 500,
      x: 500,
      y: 500,
      type: "rect",
      rotatedRadians: Math.PI / 3,
      points: [],
      selected: false,
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
    selectShape: (state, action) => {
      let point: Point = action.payload;

      for (let i = 0; i < state.shapes.length; i++) {
        let shape = state.shapes[i];
        let virtual_x = toVirtualX(shape.x, state.vpOriginX, state.scale);
        let virtual_y = toVirtualY(shape.y, state.vpOriginY, state.scale);
        let { x: virtual_nsx, y: virtual_nsy } = rotateCoordinates(
          { x: virtual_x, y: virtual_y },
          {
            x: toVirtualX(shape.noteSafeX, state.vpOriginX, state.scale),
            y: toVirtualY(shape.noteSafeY, state.vpOriginY, state.scale),
          },
          shape.rotatedRadians
        );

        let pointInBox = isPointInBox(
          rotateCoordinates(
            { x: virtual_x, y: virtual_y },
            point,
            shape.rotatedRadians
          ),
          { x: virtual_x, y: virtual_y },
          {
            x: virtual_x + shape.width * state.scale,
            y: virtual_y + shape.height * state.scale,
          }
        );
        let pointInNoteBox = isPointInBox(
          rotateCoordinates(
            { x: virtual_x, y: virtual_y },
            point,
            shape.rotatedRadians
          ),
          { x: virtual_nsx, y: virtual_nsy },
          {
            x: virtual_nsx + shape.noteSafeWidth * state.scale,
            y: virtual_nsy + shape.noteSafeHeight * state.scale,
          }
        );
        if (pointInBox && !pointInNoteBox) {
          state.shapes[i].selected = true;
          console.log("selected");
          return;
        }
      }
      console.log("not selected");
    },
    deselectIfOutOfBounds: (state, action) => {
      let point: Point = action.payload;
      for (let i = 0; i < state.shapes.length; i++) {
        let shape = state.shapes[i];
        let virtual_x = toVirtualX(shape.x, state.vpOriginX, state.scale);
        let virtual_y = toVirtualY(shape.y, state.vpOriginY, state.scale);
        if (shape) {
          if (
            !isPointInBox(
              rotateCoordinates(
                { x: virtual_x, y: virtual_y },
                point,
                shape.rotatedRadians
              ),
              { x: virtual_x, y: virtual_y },
              {
                x: virtual_x + shape.width * state.scale,
                y: virtual_y + shape.height * state.scale,
              }
            )
          ) {
            state.shapes[i].selected = false;
            break;
          }
        }
      }
    },
  },
});

export const {
  shiftOriginX,
  changeScale,
  shiftOriginY,
  setRendered,
  addShape,
  selectShape,
  deselectIfOutOfBounds,
} = canvasSlice.actions;

export const { reducer: canvasReducer } = canvasSlice;
