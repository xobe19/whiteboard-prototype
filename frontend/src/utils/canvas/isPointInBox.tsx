import { Point } from "../../entities/Point";

export function isPointInBox(point: Point, boxSt: Point, boxEn: Point) {
  return (
    point.x >= boxSt.x &&
    point.y >= boxSt.y &&
    point.x <= boxEn.x &&
    point.y <= boxEn.y
  );
}
