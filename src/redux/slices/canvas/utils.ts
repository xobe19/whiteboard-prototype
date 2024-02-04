import { Point } from "./types";

export function getRealPoint(b: Point, c: Point, canvasZoom: number): Point {
  // b -> real co-ordinates of point B
  // c -> virtual co-ordinates of point C
  // NOTE : virtual co-ordinates of C are always positive (since we get them from screen click)

  let realC = { x: 0, y: 0 };

  realC.x = b.x + c.x / canvasZoom;
  realC.y = b.y - c.y / canvasZoom;

  return realC;
}

export function getVirtualPoint(b: Point, c: Point, canvasZoom: number): Point {
  // b -> real co-ordinates of point B
  // c -> real co-ordinates of point C

  let virtualC = { x: 0, y: 0 };

  virtualC.x = (c.x - b.x) * canvasZoom;
  virtualC.y = (b.y - c.y) * canvasZoom;

  return virtualC;
}
