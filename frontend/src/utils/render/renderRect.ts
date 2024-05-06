import { Canvas, SolidShape } from "../../redux/slices/editor/types";
import {
  getBoundaryPoints,
  getCenter,
  getVirtualDistance,
  getVirtualPoint,
  rotateCoordinates,
} from "../../redux/slices/editor/utils";

export default function renderRect(
  ctx: CanvasRenderingContext2D,
  canvasState: Canvas,
  shape: SolidShape
) {
  console.log("rendering rectangle");
  const center = getCenter(shape);

  const boundaryPoints = getBoundaryPoints(shape);

  const rotatedBoundaryPoints = boundaryPoints.map((point) =>
    rotateCoordinates(center, point, shape.xAxisInclination, false)
  );

  const finalVirtualPoints = rotatedBoundaryPoints.map((point) =>
    getVirtualPoint(canvasState.b, point, canvasState.zoom)
  );

  ctx.strokeStyle = shape.backgroundColor;

  const path = new Path2D();
  path.moveTo(finalVirtualPoints[0].virtualX, finalVirtualPoints[0].virtualY);
  for (let i = 1; i < 4; i++) {
    path.lineTo(finalVirtualPoints[i].virtualX, finalVirtualPoints[i].virtualY);
  }
  path.lineTo(finalVirtualPoints[0].virtualX, finalVirtualPoints[0].virtualY);
  ctx.beginPath();
  ctx.stroke(path);
}
