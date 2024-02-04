export interface Point {
  x: number;
  y: number;
}

type solidShapeType = "crcl" | "rect" | "trng";

export interface SolidShape {
  id: string;
  type: solidShapeType;
  backgroundColor: string;
  backgroundFilled: boolean;
  shapeTopLeftCoordinates: Point;
  width: number;
  height: number;
  noteContents: string;
  xAxisInclination: number;
}

export interface FreeDrawnShape {
  initiallyDrawnPointsRelativeToTopLeft: Point[];
  topLeftCoordinates: Point;
  width: number;
  height: number;
  xAxisInclination: number;
}

export enum CanvasMode {
  ShapeCreateP1,
  ShapeCreateP2,
  FreeDraw,
  Default,
  ShapeModify,
}

export interface Toolbox {
  selectedColor: string;
  selectedSolidShapeType: solidShapeType;
}

export interface Canvas {
  id: string;
  currentOrigin: Point;
  zoom: number;
  shapes: (SolidShape | FreeDrawnShape)[];
  mode: CanvasMode;
  toolbox: Toolbox;
  isMouseDown: boolean;
  isCtrlDown: boolean;
  previousMouseDown: Point[];
}
