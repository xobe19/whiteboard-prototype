import { configureStore } from "@reduxjs/toolkit";
import { CanvasMode } from "../redux/slices/canvas/types";
import {
  canvasReducer,
  mouseDown,
  mouseUp,
  changeCanvasMode,
  panCanvas,
  zoomCanvas,
  mouseMove,
  rightMouseDown,
  rightMouseUp,
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
  store.dispatch(mouseUp({ x: 300, y: 400 }));
  expect(store.getState().canvas.mode).toBe(CanvasMode.Default);
  let new_shape_cnt = store.getState().canvas.shapes.length;
  expect(new_shape_cnt - old_shape_cnt).toBe(1);
});

test("adding shapes in a weird way (without panning)", () => {
  store.dispatch(changeCanvasMode(CanvasMode.CreateShape));
  store.dispatch(mouseDown({ x: 5, y: 4 }));
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
  store.dispatch(rightMouseDown());
  store.dispatch(mouseMove({ deltaX: 1, deltaY: 1, x: 1, y: 1 }));
  store.dispatch(rightMouseUp());
  store.dispatch(changeCanvasMode(CanvasMode.CreateShape));
  store.dispatch(mouseDown({ x: 5, y: 4 }));
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

test("adding shapes while zoomed in", () => {
  store.dispatch(zoomCanvas(1));
  store.dispatch(changeCanvasMode(CanvasMode.CreateShape));
  store.dispatch(mouseDown({ x: 5, y: 4 }));
  store.dispatch(mouseUp({ x: 4, y: 6 }));
  expect(store.getState().canvas.mode).toBe(CanvasMode.Default);
  // get the newly inserted shape
  let shapes = store.getState().canvas.shapes;
  let recently_inserted_shape = shapes[shapes.length - 1];
  expect(recently_inserted_shape.shapeTopLeftCoordinates).toStrictEqual({
    x: 2,
    y: -2,
  });
  expect(recently_inserted_shape.width).toBeCloseTo(0.5);
  expect(recently_inserted_shape.height).toBe(1);
});

test("testing free drawing", () => {
  store.dispatch(changeCanvasMode(CanvasMode.FreeDraw));
  store.dispatch(mouseMove({ x: 1, y: 1, deltaX: 1, deltaY: 1 }));
  store.dispatch(mouseDown({ x: 1, y: 1 }));
  store.dispatch(mouseMove({ x: 2, y: 2, deltaX: 1, deltaY: 1 }));
  store.dispatch(mouseMove({ x: 3, y: 3, deltaX: 1, deltaY: 1 }));
  store.dispatch(mouseUp({ x: 3, y: 3 }));
  store.dispatch(mouseMove({ x: 4, y: 4, deltaX: 1, deltaY: 1 }));
  let shapes = store.getState().canvas.shapes;
  let recently_inserted_shape = shapes[shapes.length - 1];
  expect(recently_inserted_shape.realPoints.length).toBe(3);
  expect(recently_inserted_shape.realPoints).toStrictEqual([
    { x: 1, y: -1 },
    { x: 2, y: -2 },
    { x: 3, y: -3 },
  ]);
});
