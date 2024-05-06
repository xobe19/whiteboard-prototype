import { Canvas, isSolidShape } from "../../redux/slices/editor/types";
import renderSolidShape from "./renderSolidShape";

export default function renderShapes(
  ctx: CanvasRenderingContext2D,
  canvasState: Canvas
) {
  const shapes = canvasState.shapes;
  for (const shape of shapes) {
    if (isSolidShape(shape)) {
      renderSolidShape(ctx, canvasState, shape);
    }
  }
}
