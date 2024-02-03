export interface Point {
  x: number;
  y: number;
}

export interface SolidShape {
  type: "crcl" | "rect" | "trng";
  backgroundColor: string;
  shapeTopLeftCoordinates: Point;
  width: number;
  height: number;
  noteContents: string;
  xAxisInclination: number;
}

export interface Canvas {
  currentOrigin: Point;
  zoom: number;
}
