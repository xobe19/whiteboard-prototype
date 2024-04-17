import { configureStore } from "@reduxjs/toolkit";
import {
  CanvasMode,
  FreeDrawnShape,
  ShapeModifierLocation,
  SolidShape,
  isSolidShape,
} from "../redux/slices/editor/types";
import {
  mouseDown,
  mouseUp,
  changeCanvasMode,
  zoomCanvas,
  mouseMove,
  rightMouseDown,
  rightMouseUp,
  editorReducer,
  shapeModifierClick,
  rotateShapeTextFieldEnter,
} from "../redux/slices/editor/slice";
import {
  getNewBoundaryPoints,
  getRotatedBoundaryPoints,
  rotateCoordinates,
} from "../redux/slices/editor/utils";
let store = configureStore({
  reducer: { editor: editorReducer },
});

beforeEach(() => {
  store = configureStore({ reducer: { editor: editorReducer } });
});

const getCv = () => {
  return store.getState().editor.canvas;
};

test("create solid shape", () => {
  let old_shape_cnt = getCv().shapes.length;
  store.dispatch(changeCanvasMode(CanvasMode.CreateShape));
  store.dispatch(mouseDown({ virtualX: 200, virtualY: 200 }));
  store.dispatch(mouseUp({ virtualX: 300, virtualY: 400 }));
  expect(getCv().mode).toBe(CanvasMode.ShapeModify);
  // change it to default for selecting shape
  store.dispatch(changeCanvasMode(CanvasMode.Default));

  let new_shape_cnt = getCv().shapes.length;
  expect(new_shape_cnt - old_shape_cnt).toBe(1);
});

test("adding shapes in a weird way (without panning)", () => {
  store.dispatch(changeCanvasMode(CanvasMode.CreateShape));
  store.dispatch(mouseDown({ virtualX: 5, virtualY: 4 }));
  store.dispatch(mouseUp({ virtualX: 4, virtualY: 6 }));
  expect(getCv().mode).toBe(CanvasMode.ShapeModify);
  // change it to default for selecting shape
  store.dispatch(changeCanvasMode(CanvasMode.Default));
  // get the newly inserted shape
  let shapes = getCv().shapes;
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
  expect(getCv().mode).toBe(CanvasMode.ShapeModify);
  // change it to default for selecting shape
  store.dispatch(changeCanvasMode(CanvasMode.Default));

  let shapes = getCv().shapes;
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
  expect(getCv().mode).toBe(CanvasMode.ShapeModify);
  // change it to default for selecting shape
  store.dispatch(changeCanvasMode(CanvasMode.Default));

  // get the newly inserted shape
  let shapes = getCv().shapes;
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
  store.dispatch(mouseMove({ virtualX: 0, virtualY: 0, deltaX: 0, deltaY: 0 }));
  store.dispatch(mouseDown({ virtualX: 1, virtualY: 1 }));
  store.dispatch(mouseMove({ virtualX: 2, virtualY: 2, deltaX: 1, deltaY: 1 }));
  store.dispatch(mouseMove({ virtualX: 3, virtualY: 3, deltaX: 1, deltaY: 1 }));
  store.dispatch(mouseUp({ virtualX: 3, virtualY: 3 }));
  expect(getCv().mode).toBe(CanvasMode.ShapeModify);
  // change it to default for selecting shape
  store.dispatch(changeCanvasMode(CanvasMode.Default));
  store.dispatch(mouseMove({ virtualX: 4, virtualY: 4, deltaX: 1, deltaY: 1 }));
  let shapes = getCv().shapes;
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

  expect(getCv().mode).toBe(CanvasMode.Default);
  expect(getCv().currFreeDrawPoints.length).toBe(0);
});

test("selecting a shape", () => {
  store.dispatch(changeCanvasMode(CanvasMode.CreateShape));
  store.dispatch(mouseDown({ virtualX: 200, virtualY: 200 }));
  store.dispatch(mouseUp({ virtualX: 300, virtualY: 400 }));

  expect(getCv().mode).toBe(CanvasMode.ShapeModify);
  // change it to default for selecting shape
  store.dispatch(changeCanvasMode(CanvasMode.Default));

  let lastShape = getCv().shapes.slice(-1)[0];
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
  expect(getCv().mode).toBe(CanvasMode.ShapeModify);
  let lastSelectedShapeID = getCv().singleSelectShapeID;
  expect(lastSelectedShapeID).toBe(shapeID);
});

test("not selecting a shape", () => {
  store.dispatch(changeCanvasMode(CanvasMode.CreateShape));
  store.dispatch(mouseDown({ virtualX: 200, virtualY: 200 }));
  store.dispatch(mouseUp({ virtualX: 300, virtualY: 400 }));
  expect(getCv().mode).toBe(CanvasMode.ShapeModify);
  // change it to default for selecting shape
  store.dispatch(changeCanvasMode(CanvasMode.Default));

  let lastShape = getCv().shapes.slice(-1)[0];
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

  store.dispatch(mouseDown({ virtualX: 250, virtualY: 500 }));
  store.dispatch(mouseUp({ virtualX: 250, virtualY: 500 }));
  store.dispatch(mouseDown({ virtualX: 100, virtualY: 300 }));
  store.dispatch(mouseUp({ virtualX: 100, virtualY: 300 }));
  expect(getCv().mode).toBe(CanvasMode.Default);
});

test("selecting free drawn shape", () => {
  store.dispatch(changeCanvasMode(CanvasMode.FreeDraw));
  store.dispatch(mouseMove({ virtualX: 1, virtualY: 1, deltaX: 1, deltaY: 1 }));
  store.dispatch(mouseDown({ virtualX: 1, virtualY: 1 }));
  store.dispatch(mouseMove({ virtualX: 2, virtualY: 2, deltaX: 1, deltaY: 1 }));
  store.dispatch(mouseMove({ virtualX: 3, virtualY: 3, deltaX: 1, deltaY: 1 }));
  store.dispatch(mouseUp({ virtualX: 3, virtualY: 3 }));
  store.dispatch(mouseMove({ virtualX: 4, virtualY: 4, deltaX: 1, deltaY: 1 }));
  expect(getCv().mode).toBe(CanvasMode.ShapeModify);
  // change it to default for selecting shape
  store.dispatch(changeCanvasMode(CanvasMode.Default));

  let shapes = getCv().shapes;
  let recently_inserted_shape = shapes[shapes.length - 1];

  if (!isSolidShape(recently_inserted_shape)) {
    store.dispatch(mouseDown({ virtualX: 1, virtualY: 1.5 }));
    store.dispatch(mouseUp({ virtualX: 1, virtualY: 1.5 }));
    expect(getCv().mode).toBe(CanvasMode.ShapeModify);
  } else {
    expect(true).toBe(false);
  }
});

test("deselecting shape", () => {
  store.dispatch(changeCanvasMode(CanvasMode.CreateShape));
  store.dispatch(mouseDown({ virtualX: 200, virtualY: 200 }));
  store.dispatch(mouseUp({ virtualX: 300, virtualY: 400 }));

  store.dispatch(mouseDown({ virtualX: 100, virtualY: 100 }));
  store.dispatch(mouseUp({ virtualX: 100, virtualY: 100 }));
  expect(getCv().mode).toBe(CanvasMode.Default);

  expect(getCv().singleSelectShapeID).toBe("");
});

test("reselecting a single shape", () => {
  store.dispatch(changeCanvasMode(CanvasMode.CreateShape));
  store.dispatch(mouseDown({ virtualX: 200, virtualY: 200 }));
  store.dispatch(mouseUp({ virtualX: 300, virtualY: 400 }));

  expect(getCv().mode).toBe(CanvasMode.ShapeModify);
  // change it to default for selecting shape
  store.dispatch(changeCanvasMode(CanvasMode.Default));

  store.dispatch(mouseDown({ virtualX: 250, virtualY: 300 }));
  store.dispatch(mouseUp({ virtualX: 250, virtualY: 300 }));

  expect(getCv().mode).toBe(CanvasMode.ShapeModify);
  // change it to default for selecting shape
  store.dispatch(changeCanvasMode(CanvasMode.Default));

  store.dispatch(changeCanvasMode(CanvasMode.CreateShape));
  store.dispatch(mouseDown({ virtualX: 400, virtualY: 350 }));
  store.dispatch(mouseUp({ virtualX: 500, virtualY: 500 }));
  store.dispatch(mouseDown({ virtualX: 450, virtualY: 400 }));

  let lastShape = getCv().shapes.slice(-1)[0];
  expect(lastShape.id).toBe(getCv().singleSelectShapeID);
});

test("resizing shape", () => {
  store.dispatch(changeCanvasMode(CanvasMode.CreateShape));
  store.dispatch(mouseDown({ virtualX: 200, virtualY: 200 }));
  store.dispatch(mouseUp({ virtualX: 300, virtualY: 400 }));

  store.dispatch(changeCanvasMode(CanvasMode.Default));

  store.dispatch(mouseDown({ virtualX: 250, virtualY: 300 }));
  store.dispatch(mouseUp({ virtualX: 250, virtualY: 300 }));

  store.dispatch(changeCanvasMode(CanvasMode.CreateShape));

  store.dispatch(mouseDown({ virtualX: 400, virtualY: 350 }));
  store.dispatch(mouseUp({ virtualX: 500, virtualY: 500 }));

  let lastShapeID = getCv().shapes.slice(-1)[0].id;
  expect(lastShapeID).toBe(getCv().singleSelectShapeID);

  //expanding top left co-ordinate
  store.dispatch(shapeModifierClick(ShapeModifierLocation.tl));
  store.dispatch(
    mouseMove({ virtualX: 300, virtualY: 300, deltaX: -300, deltaY: -50 })
  );

  //expanding top right co-ordinate
  store.dispatch(shapeModifierClick(ShapeModifierLocation.tr));
  store.dispatch(
    mouseMove({ virtualX: 200, virtualY: 600, deltaX: 0, deltaY: 0 })
  );

  //expanding bottom left co-ordinate
  store.dispatch(shapeModifierClick(ShapeModifierLocation.bl));
  store.dispatch(
    mouseMove({ virtualX: 100, virtualY: 800, deltaX: 0, deltaY: 0 })
  );
  store.dispatch(mouseUp({ virtualX: 100, virtualY: 800 }));
  expect(
    (getCv().shapes.slice(-1)[0] as SolidShape).shapeTopLeftCoordinates
  ).toStrictEqual({
    realX: 100,
    realY: -500,
  });
  expect((getCv().shapes.slice(-1)[0] as SolidShape).width).toBe(200);

  expect((getCv().shapes.slice(-1)[0] as SolidShape).height).toBe(300);

  expect(getCv().activeShapeModifierLocation).toBeUndefined();
});

test("rotation function & direction", () => {
  let rotated = rotateCoordinates(
    { realX: 0, realY: 0 },
    { realX: 1, realY: 1 },
    Math.PI / 4,
    true
  );
  expect(rotated.realX).toBeCloseTo(Math.sqrt(2));
  expect(rotated.realY).toBeCloseTo(0);

  let rotated2 = rotateCoordinates(
    { realX: 0, realY: 0 },
    { realX: 1, realY: 1 },
    Math.PI / 4,
    false
  );
  expect(rotated2.realX).toBeCloseTo(0);
  expect(rotated2.realY).toBeCloseTo(Math.sqrt(2));
});

test("rotate shape", () => {
  // 1. creating shape
  store.dispatch(changeCanvasMode(CanvasMode.CreateShape));
  store.dispatch(mouseDown({ virtualX: 200, virtualY: 200 }));
  store.dispatch(mouseUp({ virtualX: 300, virtualY: 400 }));

  //3. passing value to rotate field
  store.dispatch(rotateShapeTextFieldEnter(45));

  let selectedShapeID = getCv().singleSelectShapeID;

  let selectedShape = store
    .getState()
    .editor.canvas.shapes.find((shape) => shape.id === selectedShapeID);

  if (selectedShape !== undefined) {
    expect(selectedShape.xAxisInclination).toBeCloseTo(Math.PI / 4);
  } else {
    expect(true).toBe(false);
  }
});

test("free drawing panning", () => {
  let fakeDelta = { deltaX: 0, deltaY: 0 };
  store.dispatch(changeCanvasMode(CanvasMode.FreeDraw));
  store.dispatch(mouseDown({ virtualX: 1, virtualY: 1 }));
  store.dispatch(mouseMove({ ...fakeDelta, virtualX: 2, virtualY: 2 }));
  store.dispatch(mouseMove({ ...fakeDelta, virtualX: 3, virtualY: 3 }));
  store.dispatch(mouseMove({ ...fakeDelta, virtualX: 4, virtualY: 4 }));
  store.dispatch(mouseMove({ ...fakeDelta, virtualX: 5, virtualY: 5 }));
  store.dispatch(mouseMove({ ...fakeDelta, virtualX: 6, virtualY: 3.5 }));
  store.dispatch(mouseMove({ ...fakeDelta, virtualX: 7, virtualY: 2 }));
  store.dispatch(mouseUp({ virtualX: 7, virtualY: 2 }));

  store.dispatch(changeCanvasMode(CanvasMode.Default));
  store.dispatch(rightMouseDown());
  store.dispatch(
    mouseMove({ virtualX: 6, virtualY: 1, deltaX: -1, deltaY: -1 })
  );
  expect(getCv().b).toStrictEqual({
    realX: 1,
    realY: -1,
  });

  store.dispatch(mouseDown({ virtualX: 6.5, virtualY: 4.5 }));
  expect(getCv().singleSelectShapeID).toBeFalsy();

  store.dispatch(mouseDown({ virtualX: 0.5, virtualY: 0.5 }));
  expect(getCv().singleSelectShapeID).toBeTruthy();

  //shape is selected now
});

test("free drawing resizing", () => {
  let fakeDelta = { deltaX: 0, deltaY: 0 };
  store.dispatch(changeCanvasMode(CanvasMode.FreeDraw));
  store.dispatch(mouseDown({ virtualX: 1, virtualY: 1 }));
  store.dispatch(mouseMove({ ...fakeDelta, virtualX: 2, virtualY: 2 }));
  store.dispatch(mouseMove({ ...fakeDelta, virtualX: 3, virtualY: 3 }));
  store.dispatch(mouseMove({ ...fakeDelta, virtualX: 4, virtualY: 4 }));
  store.dispatch(mouseMove({ ...fakeDelta, virtualX: 5, virtualY: 5 }));
  store.dispatch(mouseMove({ ...fakeDelta, virtualX: 6, virtualY: 3.5 }));
  store.dispatch(mouseMove({ ...fakeDelta, virtualX: 7, virtualY: 2 }));
  store.dispatch(mouseUp({ virtualX: 7, virtualY: 2 }));

  store.dispatch(shapeModifierClick(ShapeModifierLocation.tl));
  store.dispatch(mouseMove({ virtualX: 0, virtualY: 1, deltaX: 0, deltaY: 0 }));
  store.dispatch(mouseUp({ virtualX: 0, virtualY: 1 }));
  let new_points = (getCv().shapes.slice(-1)[0] as FreeDrawnShape).points;

  expect(new_points).toStrictEqual([
    { realX: 0, realY: -1 },
    { realX: 1.1666666666666667, realY: -2 },
    { realX: 2.3333333333333335, realY: -3 },
    { realX: 3.5, realY: -4 },
    { realX: 4.666666666666667, realY: -5 },
    { realX: 5.833333333333334, realY: -3.5 },
    { realX: 7, realY: -2 },
  ]);
});

test("checking if a rotated solid shape is selected", () => {
  //creating the shape
  store.dispatch(changeCanvasMode(CanvasMode.CreateShape));
  store.dispatch(mouseDown({ virtualX: 200, virtualY: 200 }));
  store.dispatch(mouseUp({ virtualX: 300, virtualY: 400 }));
  //selecting the shape to rotate it
  store.dispatch(rotateShapeTextFieldEnter(60));

  store.dispatch(mouseDown({ virtualX: 250, virtualY: 150 }));

  expect(getCv().singleSelectShapeID).not.toBeUndefined();
});

test("rotated boundary points function", () => {
  let points = getRotatedBoundaryPoints(
    { realX: 1, realY: -2 },
    3,
    5,
    Math.PI / 3
  );

  expect(points).toStrictEqual([
    { realX: 1, realY: -2 },
    { realX: 2.5000000000000004, realY: 0.598076211353316 },
    { realX: 5.330127018922193, realY: -4.5 },
    { realX: 6.830127018922193, realY: -1.9019237886466844 },
  ]);
});

test("resizing rotated fn", () => {
  let points = getNewBoundaryPoints(
    getRotatedBoundaryPoints({ realX: 1, realY: -2 }, 3, 5, Math.PI / 3),
    ShapeModifierLocation.tr,
    { realX: 4, realY: -1 }
  );

  expect(points).toStrictEqual([
    { realX: 4, realY: -1 },
    { realX: 5.330127018922193, realY: -4.5 },
    { realX: 2.81698729810778, realY: -3.049038105676659 },
    { realX: 6.5131397208144115, realY: -2.4509618943233416 },
  ]);
});

test("resizing solid shape", () => {
  store.dispatch(changeCanvasMode(CanvasMode.CreateShape));
  store.dispatch(mouseDown({ virtualX: 1, virtualY: 2 }));
  store.dispatch(mouseUp({ virtualX: 4, virtualY: 7 }));

  store.dispatch(rotateShapeTextFieldEnter(60));

  store.dispatch(shapeModifierClick(ShapeModifierLocation.tr));
  store.dispatch(mouseMove({ virtualX: 4, virtualY: 1, deltaX: 0, deltaY: 0 }));

  let shape = getCv().shapes.slice(-1)[0] as SolidShape;

  expect(shape.shapeTopLeftCoordinates).toStrictEqual({
    realX: 2.81698729810778,
    realY: -3.049038105676659,
  });
  expect(shape.width).toBeCloseTo(2.3660254);
  expect(shape.height).toBeCloseTo(2.9019);
});

test("shape dragging", () => {
  store.dispatch(changeCanvasMode(CanvasMode.CreateShape));
  store.dispatch(mouseDown({ virtualX: 200, virtualY: 200 }));
  store.dispatch(mouseUp({ virtualX: 300, virtualY: 400 }));

  store.dispatch(rotateShapeTextFieldEnter(60));
  expect(getCv().singleSelectShapeID).not.toBeUndefined();
  //shape is selected already before reaching here
  store.dispatch(mouseDown({ virtualX: 250, virtualY: 225 }));
  expect(getCv().activeShapeModifierLocation).not.toBeUndefined();
  store.dispatch(
    mouseMove({ virtualX: 0, virtualY: 0, deltaX: 250, deltaY: -250 })
  );
  let shape = getCv().shapes.slice(-1)[0] as SolidShape;
  expect(shape.shapeTopLeftCoordinates).toStrictEqual({
    realX: 450,
    realY: -450,
  });
  expect(shape.width).toBe(100);
  expect(shape.height).toBe(200);
});

test("drawing an arrow between two shapes", () => {
  store.dispatch(changeCanvasMode(CanvasMode.CreateShape));
  store.dispatch(mouseDown({ virtualX: 200, virtualY: 200 }));
  store.dispatch(mouseUp({ virtualX: 300, virtualY: 400 }));

  let shape1ID = getCv().shapes.slice(-1)[0].id;

  store.dispatch(changeCanvasMode(CanvasMode.CreateShape));
  store.dispatch(mouseDown({ virtualX: 1000, virtualY: 1400 }));
  store.dispatch(mouseUp({ virtualX: 1500, virtualY: 1700 }));

  let shape2ID = getCv().shapes.slice(-1)[0].id;

  store.dispatch(changeCanvasMode(CanvasMode.DrawArrow));

  store.dispatch(mouseDown({ virtualX: 250, virtualY: 300 }));
  store.dispatch(mouseUp({ virtualX: 1200, virtualY: 1500 }));

  let latestArrow = getCv().arrows.slice(-1)[0];

  expect(latestArrow.fromShapeID).toBe(shape1ID);
  expect(latestArrow.toShapeID).toBe(shape2ID);
});
test("drawing an arrow but it's aborted", () => {
  store.dispatch(changeCanvasMode(CanvasMode.CreateShape));
  store.dispatch(mouseDown({ virtualX: 200, virtualY: 200 }));
  store.dispatch(mouseUp({ virtualX: 300, virtualY: 400 }));

  store.dispatch(changeCanvasMode(CanvasMode.CreateShape));
  store.dispatch(mouseDown({ virtualX: 1000, virtualY: 1400 }));
  store.dispatch(mouseUp({ virtualX: 1500, virtualY: 1700 }));

  store.dispatch(changeCanvasMode(CanvasMode.DrawArrow));

  store.dispatch(mouseDown({ virtualX: 250, virtualY: 300 }));
  store.dispatch(mouseUp({ virtualX: 700, virtualY: 1500 }));

  expect(getCv().arrows.length).toBe(0);
});
