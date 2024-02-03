import { Point } from "./Point";

export interface SolidShape {
  id: string;
  type: "crcl" | "rect" | "trng";
  backgroundColor: string;
  backgroundFilled: boolean;
  shapeTopLeftCoordinates: Point;
  width: number;
  height: number;
  noteContents: string;
  xAxisInclination: number;
}
