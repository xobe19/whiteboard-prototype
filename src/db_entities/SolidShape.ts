import { Point } from "./Point";

export interface SolidShape {
  type: "crcl" | "rect" | "trng",
  backgroundColor: string,
  shapeTopLeftCoordinates: Point,
  width: number,
  height: number,
  noteContents: string,
  xAxisInclination: number,
}
