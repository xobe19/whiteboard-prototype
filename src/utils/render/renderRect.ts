import { Canvas, SolidShape } from "../../redux/slices/editor/types";
import {
  getCenter,
  getVirtualDistance,
  getVirtualPoint,
} from "../../redux/slices/editor/utils";

export default function renderRect(
  ctx: CanvasRenderingContext2D,
  canvasState: Canvas,
  shape: SolidShape
) {
  console.log("rendering rectangle");
  const center = getCenter(shape);
  const virtualCenter = getVirtualPoint(
    canvasState.b,
    center,
    canvasState.zoom
  );
  ctx.translate(virtualCenter.virtualX, virtualCenter.virtualY);
  ctx.rotate(shape.xAxisInclination);
  ctx.strokeStyle = shape.backgroundColor;
  const virtualTopLeft = getVirtualPoint(
    canvasState.b,
    shape.shapeTopLeftCoordinates,
    canvasState.zoom
  );
  const virtualWidth = getVirtualDistance(shape.width, canvasState.zoom);
  const virtualHeight = getVirtualDistance(shape.height, canvasState.zoom);
  ctx.strokeRect(
    virtualTopLeft.virtualX - virtualCenter.virtualX,
    virtualTopLeft.virtualY - virtualCenter.virtualY,
    virtualWidth,
    virtualHeight
  );
  ctx.rotate(-shape.xAxisInclination);
  ctx.translate(-virtualCenter.virtualX, -virtualCenter.virtualY);
}
