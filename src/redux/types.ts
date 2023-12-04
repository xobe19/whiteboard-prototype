import { Canvas } from "../entities/Canvas";
import { Shape } from "../entities/Shape";

export interface ReduxStore {
  canvas: CanvasState
}

// shanding = shrinking / expanding :P
export type DrawingMode = "drawing" | "creatingShape" | "select" | "selected" | "shanding";


export interface CanvasState extends Canvas {
  rendered: false;
  vpOriginX: number;
  vpOriginY: number;
  scale: number;
  drawingMode: DrawingMode;
  shapes: ShapeState[];
}

export interface ShapeState extends Shape {
  selected: boolean,
  interacting: boolean 
}
