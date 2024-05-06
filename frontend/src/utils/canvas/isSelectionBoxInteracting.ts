import { Point } from "../../entities/Point";
import { isPointInBox } from "./isPointInBox";

export function isSelectionBoxInteracting(point: Point, boxEn: Point) : boolean {
 return isPointInBox(point, {x: boxEn.x - 15, y: boxEn.y-15}, {x: boxEn.x + 15, y: boxEn.y + 15});
}