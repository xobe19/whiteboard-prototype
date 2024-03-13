import { configureStore } from "@reduxjs/toolkit";
import { CanvasMode, isSolidShape } from "../redux/slices/editor/types";
import {
  mouseDown,
  mouseUp,
  changeCanvasMode,
  zoomCanvas,
  mouseMove,
  rightMouseDown,
  rightMouseUp,
  editorReducer,
} from "../redux/slices/editor/slice";
let store = configureStore({
  reducer: { editor: editorReducer },
});
beforeEach(() => {
  store = configureStore({ reducer: { editor: editorReducer } });
});

test("create solid shape", () => {
  let old_shape_cnt = store.getState().editor.canvas.shapes.length;
  store.dispatch(changeCanvasMode(CanvasMode.CreateShape));
  store.dispatch(mouseDown({ virtualX: 200, virtualY: 200 }));
  store.dispatch(mouseUp({ virtualX: 300, virtualY: 400 }));
  expect(store.getState().editor.canvas.mode).toBe(CanvasMode.Default);
  let new_shape_cnt = store.getState().editor.canvas.shapes.length;
  expect(new_shape_cnt - old_shape_cnt).toBe(1);
});

test("adding shapes in a weird way (without panning)", () => {
  store.dispatch(changeCanvasMode(CanvasMode.CreateShape));
  store.dispatch(mouseDown({ virtualX: 5, virtualY: 4 }));
  store.dispatch(mouseUp({ virtualX: 4, virtualY: 6 }));
  expect(store.getState().editor.canvas.mode).toBe(CanvasMode.Default);
  // get the newly inserted shape
  let shapes = store.getState().editor.canvas.shapes;
  let recently_inserted_shape = shapes[shapes.length - 1];
  if (isSolidShape(recently_inserted_shape)) {
    expect(recently_inserted_shape.shapeTopLeftCoordinates).toStrictEqual({
      realX: 4,
      realY: -4,
    });
    expect(recently_inserted_shape.width).toBe(1);
    expect(recently_inserted_shape.height).toBe(2);
  } else {
    expect(true).toBe(false);
  }
});

test("adding shapes in even weird way (with panning)", () => {
  store.dispatch(rightMouseDown());
  store.dispatch(mouseMove({ deltaX: 1, deltaY: 1, virtualX: 1, virtualY: 1 }));
  store.dispatch(rightMouseUp());
  store.dispatch(changeCanvasMode(CanvasMode.CreateShape));
  store.dispatch(mouseDown({ virtualX: 5, virtualY: 4 }));
  store.dispatch(mouseUp({ virtualX: 4, virtualY: 6 }));
  expect(store.getState().editor.canvas.mode).toBe(CanvasMode.Default);

  let shapes = store.getState().editor.canvas.shapes;
  let recently_inserted_shape = shapes[shapes.length - 1];
  if (isSolidShape(recently_inserted_shape)) {
    expect(recently_inserted_shape.shapeTopLeftCoordinates).toStrictEqual({
      realX: 3,
      realY: -3,
    });
    expect(recently_inserted_shape.width).toBe(1);
    expect(recently_inserted_shape.height).toBe(2);
  } else {
    expect(true).toBe(false);
  }
});

test("adding shapes while zoomed in", () => {
  store.dispatch(zoomCanvas(1));
  store.dispatch(changeCanvasMode(CanvasMode.CreateShape));
  store.dispatch(mouseDown({ virtualX: 5, virtualY: 4 }));
  store.dispatch(mouseUp({ virtualX: 4, virtualY: 6 }));
  expect(store.getState().editor.canvas.mode).toBe(CanvasMode.Default);
  // get the newly inserted shape
  let shapes = store.getState().editor.canvas.shapes;
  let recently_inserted_shape = shapes[shapes.length - 1];

  if (isSolidShape(recently_inserted_shape)) {
    expect(recently_inserted_shape.shapeTopLeftCoordinates).toStrictEqual({
      realX: 2,
      realY: -2,
    });
    expect(recently_inserted_shape.width).toBeCloseTo(0.5);
    expect(recently_inserted_shape.height).toBe(1);
  } else {
    expect(true).toBe(false);
  }
});

test("testing free drawing", () => {
  store.dispatch(changeCanvasMode(CanvasMode.FreeDraw));
  store.dispatch(mouseMove({ virtualX: 1, virtualY: 1, deltaX: 1, deltaY: 1 }));
  store.dispatch(mouseDown({ virtualX: 1, virtualY: 1 }));
  store.dispatch(mouseMove({ virtualX: 2, virtualY: 2, deltaX: 1, deltaY: 1 }));
  store.dispatch(mouseMove({ virtualX: 3, virtualY: 3, deltaX: 1, deltaY: 1 }));
  store.dispatch(mouseUp({ virtualX: 3, virtualY: 3 }));
  store.dispatch(mouseMove({ virtualX: 4, virtualY: 4, deltaX: 1, deltaY: 1 }));
  let shapes = store.getState().editor.canvas.shapes;
  let recently_inserted_shape = shapes[shapes.length - 1];

  if (!isSolidShape(recently_inserted_shape)) {
    expect(recently_inserted_shape.points.length).toBe(3);
    expect(recently_inserted_shape.points).toStrictEqual([
      { realX: 1, realY: -1 },
      { realX: 2, realY: -2 },
      { realX: 3, realY: -3 },
    ]);
  } else {
    expect(true).toBe(false);
  }
});

test("selecting a shape", () => {
  store.dispatch(changeCanvasMode(CanvasMode.CreateShape));
  store.dispatch(mouseDown({ virtualX: 200, virtualY: 200 }));
  store.dispatch(mouseUp({ virtualX: 300, virtualY: 400 }));
  expect(store.getState().editor.canvas.mode).toBe(CanvasMode.Default);

  let lastShape = store.getState().editor.canvas.shapes.slice(-1)[0];
  if (isSolidShape(lastShape)) {
    let pnt = lastShape.shapeTopLeftCoordinates;
    expect(pnt).toStrictEqual({
      realX: 200,
      realY: -200,
    });

    expect(lastShape.width).toBe(100);
    expect(lastShape.height).toBe(200);
  } else {
    expect(true).toBe(false);
  }

  let shapeID = lastShape.id;
  store.dispatch(mouseDown({ virtualX: 250, virtualY: 300 }));
  expect(store.getState().editor.canvas.mode).toBe(CanvasMode.ShapeModify);
  let lastSelectedShapeID = store.getState().editor.canvas.singleSelectShapeID;
  expect(lastSelectedShapeID).toBe(shapeID);
});
