import { Canvas } from "../../redux/slices/editor/types";
import renderBackgroundDots from "./renderBackgroundDots";

// renders the given `canvasState` onto the rendering context
export default function renderCanvas(
  ctx: CanvasRenderingContext2D,
  canvasState: Canvas
) {
  console.log("canvas render");
  ctx.clearRect(0, 0, canvasState.width, canvasState.height);
  renderBackgroundDots(ctx, canvasState);
}
