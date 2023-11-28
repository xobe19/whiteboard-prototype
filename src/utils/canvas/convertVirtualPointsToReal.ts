import { toRealX, toRealY } from "../../entities/Canvas";
import { Shape } from "../../entities/Shape";
import { CanvasState } from "../../redux/types";

export function convertVirtualPointsToReal(shapeNew: Shape, shape: Shape, state: CanvasState) {
  for (let i = 0; i < shapeNew.points.length; i++) {
    [shapeNew.points[i].x, shapeNew.points[i].y] = [
      toRealX(shape.points[i].x, state.vpOriginX, state.scale),
      toRealY(shape.points[i].y, state.vpOriginY, state.scale),
    ];
  }
}
