export interface Point {
  x: number;
  y: number;
}

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

export interface FreeDrawnShape {
  id: string;
  initiallyDrawnPointsRelativeToTopLeft: Point[];
  topLeftCoordinates: Point;
  width: number;
  height: number;
  xAxisInclination: number;
  strokeColor: string;
}

export enum CanvasMode {
  ShapeCreate,
  FreeDraw,
  Default,
  ShapeModify,
}

export interface Canvas {
  id: string;
  currentOrigin: Point;
  zoom: number;
  shapes: (SolidShape | FreeDrawnShape)[];
  mode: CanvasMode;
  isMouseDown: boolean;
  isCtrlDown: boolean;
  previousMouseDown: Point[];
}
