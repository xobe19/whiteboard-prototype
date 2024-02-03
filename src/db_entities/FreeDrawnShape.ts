import { Point } from "./Point";

export interface FreeDrawnShape {
  id: string;
  initiallyDrawnPointsRelativeToTopLeft: Point[];
  topLeftCoordinates: Point;
  width: number;
  height: number;
  xAxisInclination: number;
  strokeColor: string;
}
