export interface Point {
  x: number;
  y: number;
}

export interface MouseMoveData {
  deltaX: number;
  deltaY: number;
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
  id: string;
  realPoints: Point[];
  strokeColor: string;
  xAxisInclination: number;
}

export enum CanvasMode {
  CreateShape,
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
  b: Point;
  zoom: number;
  shapes: (SolidShape | FreeDrawnShape)[];
  mode: CanvasMode;
  toolbox: Toolbox;
  isMouseDown: boolean;
  isRightMouseDown: boolean;
  isCtrlDown: boolean;
  previousMouseDown?: Point;
  currFreeDrawPoints: Point[];
}
