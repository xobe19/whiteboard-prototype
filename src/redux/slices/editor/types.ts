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
}

type solidShapeType = "crcl" | "rect" | "trng";

export interface SolidShape {
  id: string;
  type: solidShapeType;
  backgroundColor: string;
  backgroundFilled: boolean;
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
}

export interface Toolbox {
  selectedColor: string;
  selectedSolidShapeType: solidShapeType;
}

export interface Canvas {
  id: string;
  b: RealPoint;
  zoom: number;
  shapes: (SolidShape | FreeDrawnShape)[];
  mode: CanvasMode;
  currFreeDrawPoints: RealPoint[];
  multiSelectShapeID: string[];
  singleSelectShapeID?: string;
  activeShapeModifierLocation?: ShapeModifierLocation;
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

export function isSolidShape(
  shape: FreeDrawnShape | SolidShape
): shape is SolidShape {
  return (shape as any)["points"] === undefined;
}
