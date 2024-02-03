import { configureStore } from "@reduxjs/toolkit";
import { CanvasMode } from "../redux/slices/canvas/types";
import { canvasReducer } from "../redux/slices/canvas/slice";
let store = configureStore({ reducer: { canvas: canvasReducer } });

beforeEach(() => {
  store = configureStore({ reducer: { canvas: canvasReducer } });
});

afterEach(() => {
  store = null;
});

test("create solid shape", () => {
  let old_shape_cnt = store.getState().canvas.shapes.length;
  store.dispatch(changeCanvasMode(CanvasMode.ShapeCreateInit));
  store.dispatch(mouseDown({ x: 200, y: 200 }));
  expect(store.getState().canvas.mode).toBe(CanvasMode.ShapeCreateMiddle);
  store.dispatch(mouseUp({ x: 300, y: 400 }));
  expect(store.getState().canvas.mode).toBe(CanvasMode.Default);
  let new_shape_cnt = store.getState().canvas.shapes.length;

  expect(new_shape_cnt - old_shape_cnt).toBe(1);
});
