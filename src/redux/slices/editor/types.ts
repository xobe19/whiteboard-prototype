export interface RealPoint {
  realX: number;
  realY: number;
}

export interface VirtualPoint {
  virtualX: number;
  virtualY: number;
}

export interface MouseMoveData {
  deltaX: number;
  deltaY: number;
  virtualX: number;
  virtualY: number;
}

export enum ShapeModifierLocation {
  tl,
  tr,
  bl,
  br,
  inside,
}

type solidShapeType = "crcl" | "rect" | "trng";

export interface SolidShape {
  id: string;
  type: solidShapeType;
  backgroundColor: string;
  borderColor: string;
  shapeTopLeftCoordinates: RealPoint;
  width: number;
  height: number;
  noteContents: string;
  xAxisInclination: number;
}

export interface FreeDrawnShape {
  id: string;
  points: RealPoint[];
  strokeColor: string;
  xAxisInclination: number;
}

export enum CanvasMode {
  CreateShape,
  FreeDraw,
  Default,
  ShapeModify,
  DrawArrow,
}

export interface Toolbox {
  selectedSolidShapeType: solidShapeType;
}

export interface Arrow {
  fromShapeID: string;
  toShapeID: string;
}

export interface Canvas {
  id: string;
  b: RealPoint;
  zoom: number;
  shapes: (SolidShape | FreeDrawnShape)[];
  mode: CanvasMode;
  currFreeDrawPoints: RealPoint[];
  singleSelectShapeID?: string;
  activeShapeModifierLocation?: ShapeModifierLocation;
  arrows: Arrow[];
}

export interface KeyState {
  isMouseDown: boolean;
  isRightMouseDown: boolean;
  isCtrlDown: boolean;
  previousMouseDown?: RealPoint;
}

export interface Editor {
  canvas: Canvas;
  toolbox: Toolbox;
  keyState: KeyState;
}

export type Line = {
  m: number;
  c: number;
};

export function isSolidShape(
  shape: FreeDrawnShape | SolidShape
): shape is SolidShape {
  return (shape as any)["points"] === undefined;
}
