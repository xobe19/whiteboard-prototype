import { Canvas, SolidShape } from "../../redux/slices/editor/types";
import renderRect from "./renderRect";

export default function renderSolidShape(
  ctx: CanvasRenderingContext2D,
  canvasState: Canvas,
  shape: SolidShape
) {
  switch (shape.type) {
    case "rect":
      renderRect(ctx, canvasState, shape);
      break;
  }
}
