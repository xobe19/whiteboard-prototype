import { Canvas } from "../../redux/slices/editor/types";

// renders the given `canvasState` onto the rendering context
export default function renderCanvas(
  ctx: CanvasRenderingContext2D,
  canvasState: Canvas
) {
  ctx.clearRect(0, 0, canvasState.width, canvasState.height);
  ctx.fillRect(0, 0, 100, 100);
}
