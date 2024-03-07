import { RealPoint, VirtualPoint } from "./types";

export function getRealPoint(
  b: RealPoint,
  c: VirtualPoint,
  canvasZoom: number
): RealPoint {
  // b -> real co-ordinates of point B
  // c -> virtual co-ordinates of point C
  // NOTE : virtual co-ordinates of C are always positive (since we get them from screen click)

  let realC = { realX: 0, realY: 0 };

  realC.realX = b.realX + c.virtualX / canvasZoom;
  realC.realY = b.realY - c.virtualY / canvasZoom;

  return realC;
}

export function getVirtualPoint(
  b: RealPoint,
  c: RealPoint,
  canvasZoom: number
): VirtualPoint {
  // b -> real co-ordinates of point B
  // c -> real co-ordinates of point C

  let virtualC = { virtualX: 0, virtualY: 0 };

  virtualC.virtualX = (c.realX - b.realX) * canvasZoom;
  virtualC.virtualY = (b.realY - c.realY) * canvasZoom;

  return virtualC;
}
