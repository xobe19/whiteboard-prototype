import { Point } from "../../entities/Point";

export function rotateCoordinates(rotateAbout: Point, pt: Point, rad: number) {
  let s = Math.sin(-rad);
  let c=  Math.cos(-rad);

  let point = {x: pt.x, y: pt.y};

  point.x -= rotateAbout.x;
  point.y -= rotateAbout.y;

  let xnew = point.x * c - point.y * s;
  let ynew = point.x * s + point.y * c;

  point.x = xnew + rotateAbout.x;
  point.y = ynew + rotateAbout.y;

  return point;
}