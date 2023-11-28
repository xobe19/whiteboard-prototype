import { Canvas } from "../entities/Canvas";
import { Point } from "../entities/Point";
import { isPointInBox } from "../utils/canvas/isPointInBox";

export interface ReduxStore {
  canvas: CanvasState
}

export interface SelectionBox {
  x: number,
  y: number,
  width: number,
  height: number,
}

function getSelectionBoxInteraction(point: Point, boxSt: Point, boxEn: Point): "up" | "down" | "left" | "right" | "drag" | null {
    if(isPointInBox(point, {x: boxSt.x, y: boxSt.y - 5}, {x: boxEn.x, y: boxSt.y + 5})) return "up";
    if(isPointInBox(point, {x: boxSt.x, y: boxEn.y - 5}, {x: boxEn.x, y: boxEn.y + 5})) return "down";
    if(isPointInBox(point, {x: boxSt.x - 5, y: boxSt.y}, {x: boxSt.x + 5, y: boxEn.y})) return "left";
    if(isPointInBox(point, {x: boxEn.x - 5, y: boxSt.y}, {x: boxEn.x + 5, y: boxEn.y})) return "left";
    return null;
}

export interface CanvasState extends Canvas {
  rendered: false;
  vpOriginX: number;
  vpOriginY: number;
  scale: number;
  selectionBox?: SelectionBox;
}
