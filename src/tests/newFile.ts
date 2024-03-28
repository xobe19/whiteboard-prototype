import {
  CanvasMode,
  ShapeModifierLocation,
  SolidShape,
} from "../redux/slices/editor/types";
import {
  mouseDown,
  mouseUp,
  changeCanvasMode,
  mouseMove,
  shapeModifierClick,
} from "../redux/slices/editor/slice";
import { store } from "./canvas.test";

test("resizing solid shape", () => {
  store.dispatch(changeCanvasMode(CanvasMode.CreateShape));
  store.dispatch(mouseDown({ virtualX: 1, virtualY: 2 }));
  store.dispatch(mouseUp({ virtualX: 4, virtualY: 7 }));
  //selecting the shape
  store.dispatch(mouseDown({ virtualX: 3, virtualY: 5 }));

  store.dispatch(shapeModifierClick(ShapeModifierLocation.tr));
  store.dispatch(mouseMove({ virtualX: 4, virtualY: 1, deltaX: 0, deltaY: 0 }));

  expect(
    (store.getState().editor.canvas.shapes.slice(-1)[0] as SolidShape)
      .shapeTopLeftCoordinates
  ).toStrictEqual([{ realX: 4, realY: -1 }]);
});
