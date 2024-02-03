import { Point } from "./Point";

export interface FreeDrawnShape {
  initiallyDrawnPointsRelativeToTopLeft: Point[],
  topLeftCoordinates: Point,
  width: number,
  height: number,
  xAxisInclination: number,
}
