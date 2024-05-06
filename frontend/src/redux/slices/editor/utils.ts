import {
  FreeDrawnShape,
  Line,
  RealPoint,
  ShapeModifierLocation,
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

export function getRealDistance(virtualDistance: number, canvasZoom: number) {
  return virtualDistance / canvasZoom;
}
export function getVirtualDistance(realDistance: number, canvasZoom: number) {
  return realDistance * canvasZoom;
}

export function isBetween(a: number, b: number, c: number) {
  return b >= a && b <= c;
}

export function isPointInSolidShape(clickedAt: RealPoint, shape: SolidShape) {
  //rotate pnt in clockwise direction by xAxisInclination

  let topLeft = shape.shapeTopLeftCoordinates;

  let rotatedClickedAt = rotateCoordinates(
    topLeft,
    clickedAt,
    shape.xAxisInclination,
    true
  );

  let bottomRight = {
    realX: topLeft.realX + shape.width,
    realY: topLeft.realY - shape.height,
  };

  return (
    isBetween(topLeft.realX, rotatedClickedAt.realX, bottomRight.realX) &&
    isBetween(bottomRight.realY, rotatedClickedAt.realY, topLeft.realY)
  );
}
// returns [tl, tr, br, bl]
export function getBoundaryPoints(
  shape: SolidShape | FreeDrawnShape
): [RealPoint, RealPoint, RealPoint, RealPoint] {
  if (isSolidShape(shape)) {
    const tl = shape.shapeTopLeftCoordinates;
    const tr = { realX: tl.realX + shape.width, realY: tl.realY };
    const bl = { realX: tl.realX, realY: tl.realY - shape.height };
    const br = {
      realX: tl.realX + shape.width,
      realY: tl.realY - shape.height,
    };
    return [tl, tr, br, bl];
  } else {
    const points = shape.points;
    const x_coordinates = points.map((e) => e.realX);
    const y_coordinates = points.map((e) => e.realY);
    const x1 = Math.min(...x_coordinates);
    const x2 = Math.max(...x_coordinates);
    const y1 = Math.max(...y_coordinates);
    const y2 = Math.min(...y_coordinates);
    const tl = { realX: x1, realY: y1 };
    const tr = { realX: x2, realY: y1 };
    const bl = { realX: x1, realY: y2 };
    const br = { realX: x2, realY: y2 };
    return [tl, tr, br, bl];
  }
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
  let y_coordinates = points.map((e) => e.realY);
  let x1 = Math.min(...x_coordinates);
  let x2 = Math.max(...x_coordinates);
  let y1 = Math.max(...y_coordinates);
  let y2 = Math.min(...y_coordinates);

  let rotatedClickedAt = rotateCoordinates(
    { realX: x1, realY: y1 },
    clickedAt,
    shape.xAxisInclination,
    true
  );
  return (
    isBetween(x1, rotatedClickedAt.realX, x2) &&
    isBetween(y2, rotatedClickedAt.realY, y1)
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

export function rotateCoordinates(
  rotateAbout: RealPoint,
  rotatingPoint: RealPoint,
  rad: number,
  clockwise: boolean
) {
  let s = Math.sin(clockwise ? -rad : rad);
  let c = Math.cos(clockwise ? -rad : rad);

  let point = { realX: rotatingPoint.realX, realY: rotatingPoint.realY };

  point.realX -= rotateAbout.realX;
  point.realY -= rotateAbout.realY;

  let xnew = point.realX * c - point.realY * s;
  let ynew = point.realX * s + point.realY * c;

  return { realX: xnew + rotateAbout.realX, realY: ynew + rotateAbout.realY };
}

export function getLineFromPoints(a: RealPoint, b: RealPoint): Line {
  let m = (b.realY - a.realY) / (b.realX - a.realX);
  let c = a.realY - m * a.realX;
  return { m, c };
}

export function getLineFromPointAndSlope(a: RealPoint, m: number): Line {
  let c = a.realY - m * a.realX;
  return { m, c };
}

export function getCenter(shape: SolidShape | FreeDrawnShape) {
  if (isSolidShape(shape)) {
    const topLeft = shape.shapeTopLeftCoordinates;
    const bottomRight = {
      realX: topLeft.realX + shape.width,
      realY: topLeft.realY - shape.height,
    };

    const centerPoint = {
      realX: (topLeft.realX + bottomRight.realX) / 2,
      realY: (bottomRight.realY + topLeft.realY) / 2,
    };
    return centerPoint;
  } else {
    const points = shape.points;
    const x_coordinates = points.map((e) => e.realX);
    const y_coordinates = points.map((e) => e.realY);
    const x1 = Math.min(...x_coordinates);
    const x2 = Math.max(...x_coordinates);
    const y1 = Math.max(...y_coordinates);
    const y2 = Math.min(...y_coordinates);

    const centerPoint = {
      realX: (x1 + x2) / 2,
      realY: (y1 + y2) / 2,
    };

    return centerPoint;
  }
}

/* return format
[tl, tr, bl, br]
*/
export function getRotatedBoundaryPoints(
  topLeftPoint: RealPoint,
  width: number,
  height: number,
  xAxisInclination: number
) {
  let points = [
    topLeftPoint,
    { realX: topLeftPoint.realX + width, realY: topLeftPoint.realY },
    { realX: topLeftPoint.realX, realY: topLeftPoint.realY - height },
    { realX: topLeftPoint.realX + width, realY: topLeftPoint.realY - height },
  ];

  let rotatedPoints = points.map((point) =>
    rotateCoordinates(topLeftPoint, point, xAxisInclination, false)
  );
  return rotatedPoints;
}

export function getNewBoundaryPoints(
  boundaryPoints: RealPoint[],
  location: Exclude<ShapeModifierLocation, ShapeModifierLocation.inside>,
  newPosition: RealPoint
) {
  let fixedPoint: RealPoint;
  let fixedLine1: Line;
  let fixedLine2: Line;
  switch (location) {
    case ShapeModifierLocation.tl:
      fixedPoint = boundaryPoints[3];
      fixedLine1 = getLineFromPoints(fixedPoint, boundaryPoints[1]);
      fixedLine2 = getLineFromPoints(fixedPoint, boundaryPoints[2]);
      break;
    case ShapeModifierLocation.tr:
      fixedPoint = boundaryPoints[2];
      fixedLine1 = getLineFromPoints(fixedPoint, boundaryPoints[0]);
      fixedLine2 = getLineFromPoints(fixedPoint, boundaryPoints[3]);
      break;
    case ShapeModifierLocation.bl:
      fixedPoint = boundaryPoints[1];
      fixedLine1 = getLineFromPoints(fixedPoint, boundaryPoints[0]);
      fixedLine2 = getLineFromPoints(fixedPoint, boundaryPoints[3]);
      break;
    case ShapeModifierLocation.br:
      fixedPoint = boundaryPoints[0];
      fixedLine1 = getLineFromPoints(fixedPoint, boundaryPoints[1]);
      fixedLine2 = getLineFromPoints(fixedPoint, boundaryPoints[2]);
      break;
  }

  return [
    newPosition,
    fixedPoint,
    getOrthogonalProjection(newPosition, fixedLine1),
    getOrthogonalProjection(newPosition, fixedLine2),
  ];
}

export function intersection(a: Line, b: Line) {
  let x = (b.c - a.c) / (a.m - b.m);
  let y = x * a.m + a.c;
  return { realX: x, realY: y };
}

export function getOrthogonalProjection(point: RealPoint, line: Line) {
  let newLine = getLineFromPointAndSlope(point, -1 / line.m);
  return intersection(newLine, line);
}

// points: RealPoint[] has points in no specific order
// selecting the left most point as pivot
export function getTopLeftPointAndWidthAndHeight(points: RealPoint[]) {
  const Xs = points.map((point) => point.realX);
  const Ys = points.map((point) => point.realY);
  let minX = Math.min(...Xs);

  let leftMostPoints: RealPoint[] = [];

  for (let point of points) {
    if (point.realX === minX) {
      leftMostPoints.push(point);
    }
  }

  if (leftMostPoints.length === 2) {
    // x axis inclination is 0
    let topLeft = { realX: minX, realY: Math.max(...Ys) };
    let bottomRight = { realX: Math.max(...Ys), realY: Math.min(...Ys) };
    return {
      topLeft,
      width: bottomRight.realX - topLeft.realX,
      height: topLeft.realY - topLeft.realX,
      xAxisInclination: 0,
    };
  } else {
    let maxY = Math.max(...Ys);
    // if leftMostPoint is 1, topMost also is only 1
    let topMostPoint = points.find((point) => point.realY === maxY)!;
    let slope =
      (topMostPoint.realY - leftMostPoints[0].realY) /
      (topMostPoint.realX - leftMostPoints[0].realX);
    let xAxisInclination = Math.atan(slope);
    let straightenedPoints = points.map((point) =>
      rotateCoordinates(leftMostPoints[0], point, xAxisInclination, true)
    );
    return {
      topLeft: leftMostPoints[0],
      width:
        Math.max(...straightenedPoints.map((point) => point.realX)) -
        leftMostPoints[0].realX,
      height:
        leftMostPoints[0].realY -
        Math.min(...straightenedPoints.map((point) => point.realY)),
      xAxisInclination,
    };
  }
}

export function floorToNearestMultiple(num: number, mult: number) {
  return Math.floor(num / mult) * mult;
}

export function ceilToNearestMultiple(num: number, mult: number) {
  return Math.ceil(num / mult) * mult;
}
