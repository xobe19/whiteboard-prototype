import { toRealX, toRealY } from "../../entities/Canvas";
import { CanvasState } from "../../redux/canvasSlice";

export function convertVirtualPointsToReal(shapeNew: Shape, shape: Shape, state: CanvasState) {
  for (let i = 0; i < shapeNew.points.length; i++) {
    [shapeNew.points[i].x, shapeNew.points[i].y] = [
      toRealX(shape.points[i].x, state.vpOriginX, state.scale),
      toRealY(shape.points[i].y, state.vpOriginY, state.scale),
    ];
  }
}
