import { Canvas } from "../entities/Canvas";

export interface ReduxStore {
  canvas: CanvasState
}

export type DrawingMode = "drawing" | "creatingShape" | "select" | "selected" | "shanding";

export interface CanvasState extends Canvas {
  rendered: false;
  vpOriginX: number;
  vpOriginY: number;
  scale: number;
  drawingMode: DrawingMode
}
