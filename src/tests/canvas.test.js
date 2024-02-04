import { configureStore } from "@reduxjs/toolkit";
import { CanvasMode } from "../redux/slices/canvas/types";
import {
  canvasReducer,
  mouseDown,
  mouseUp,
  changeCanvasMode,
  panCanvas,
} from "../redux/slices/canvas/slice";
let store = configureStore({ reducer: { canvas: canvasReducer } });

beforeEach(() => {
  store = configureStore({ reducer: { canvas: canvasReducer } });
});

afterEach(() => {
  store = null;
});

test("create solid shape", () => {
  let old_shape_cnt = store.getState().canvas.shapes.length;
  store.dispatch(changeCanvasMode(CanvasMode.CreateShape));
  store.dispatch(mouseDown({ x: 200, y: 200 }));
  expect(store.getState().canvas.mode).toBe(CanvasMode.CreatingShape);
  store.dispatch(mouseUp({ x: 300, y: 400 }));
  expect(store.getState().canvas.mode).toBe(CanvasMode.Default);
  let new_shape_cnt = store.getState().canvas.shapes.length;
  expect(new_shape_cnt - old_shape_cnt).toBe(1);
});

test("adding shapes in a weird way (without panning)", () => {
  store.dispatch(changeCanvasMode(CanvasMode.CreateShape));
  store.dispatch(mouseDown({ x: 5, y: 4 }));
  expect(store.getState().canvas.mode).toBe(CanvasMode.CreatingShape);
  store.dispatch(mouseUp({ x: 4, y: 6 }));
  expect(store.getState().canvas.mode).toBe(CanvasMode.Default);
  // get the newly inserted shape
  let shapes = store.getState().canvas.shapes;
  let recently_inserted_shape = shapes[shapes.length - 1];
  expect(recently_inserted_shape.shapeTopLeftCoordinates).toStrictEqual({
    x: 4,
    y: -4,
  });
  expect(recently_inserted_shape.width).toBe(1);
  expect(recently_inserted_shape.height).toBe(2);
});

test("adding shapes in even weird way (with panning)", () => {
  store.dispatch(panCanvas({ deltaX: 1, deltaY: 1 }));
  store.dispatch(changeCanvasMode(CanvasMode.CreateShape));
  store.dispatch(mouseDown({ x: 5, y: 4 }));
  expect(store.getState().canvas.mode).toBe(CanvasMode.CreatingShape);
  store.dispatch(mouseUp({ x: 4, y: 6 }));
  expect(store.getState().canvas.mode).toBe(CanvasMode.Default);

  let shapes = store.getState().canvas.shapes;
  let recently_inserted_shape = shapes[shapes.length - 1];
  expect(recently_inserted_shape.shapeTopLeftCoordinates).toStrictEqual({
    x: 3,
    y: -3,
  });
  expect(recently_inserted_shape.width).toBe(1);
  expect(recently_inserted_shape.height).toBe(2);
});
