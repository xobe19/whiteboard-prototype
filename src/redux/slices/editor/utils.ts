import {
  FreeDrawnShape,
  RealPoint,
  SolidShape,
  VirtualPoint,
  isSolidShape,
} from "./types";

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

export function isBetween(a: number, b: number, c: number) {
  return b >= a && b <= c;
}

export function isPointInSolidShape(clickedAt: RealPoint, shape: SolidShape) {
  let topLeft = shape.shapeTopLeftCoordinates;
  let bottomRight = {
    realX: topLeft.realX + shape.width,
    realY: topLeft.realY - shape.height,
  };

  return (
    isBetween(topLeft.realX, clickedAt.realX, bottomRight.realX) &&
    (topLeft.realY, clickedAt.realY, bottomRight.realY)
  );
}

/*

(x1, y1) 


            (x2, y2)

*/
export function isPointInFreeShape(
  clickedAt: RealPoint,
  shape: FreeDrawnShape
) {
  let points = shape.points;
  let x_coordinates = points.map((e) => e.realX);
  let y_coordinates = points.map((e) => e.realX);
  let x1 = Math.min(...x_coordinates);
  let x2 = Math.max(...x_coordinates);
  let y1 = Math.max(...y_coordinates);
  let y2 = Math.min(...y_coordinates);

  return (
    isBetween(x1, clickedAt.realX, x2) && isBetween(y2, clickedAt.realY, y1)
  );
}

export function getSelectedShapeID(
  clickedAt: RealPoint,
  shapes: (SolidShape | FreeDrawnShape)[]
) {
  for (let shape of shapes) {
    if (isSolidShape(shape)) {
      if (isPointInSolidShape(clickedAt, shape)) {
        return shape.id;
      }
    } else {
      if (isPointInFreeShape(clickedAt, shape)) {
        return shape.id;
      }
    }
  }
  return "";
}
