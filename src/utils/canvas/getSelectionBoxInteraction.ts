import { Point } from "../../entities/Point";
import { isPointInBox } from "./isPointInBox";

export function getSelectionBoxInteraction(
  point: Point,
  boxSt: Point,
  boxEn: Point
): "up" | "down" | "left" | "right" | "drag" | null {
  let width = boxEn.x - boxSt.x;
  let height = boxEn.y - boxSt.y;

  if (
    isPointInBox(
      point,
      { x: boxSt.x, y: boxSt.y - 5 },
      { x: boxSt.x + (width / 2 - 5), y: boxSt.y + 5 }
    ) ||
    isPointInBox(
      point,
      { x: boxSt.x + (width / 2 + 5), y: boxSt.y - 5 },
      { x: boxEn.x, y: boxSt.y + 5 }
    )
  )
    return "up";
  if (
    isPointInBox(
      point,
      { x: boxSt.x, y: boxEn.y - 5 },
      { x: boxSt.x + (width / 2 - 5), y: boxEn.y + 5 }
    ) ||
    isPointInBox(
      point,
      { x: boxSt.x + (width / 2 + 5), y: boxEn.y - 5 },
      { x: boxEn.x, y: boxEn.y + 5 }
    )
  )
    return "down";
  if (
    isPointInBox(
      point,
      { x: boxSt.x - 5, y: boxSt.y },
      { x: boxSt.x + 5, y: boxSt.y + height / 2 - 5 }
    ) ||
    isPointInBox(
      point,
      { x: boxSt.x - 5, y: boxSt.y + (height / 2 + 5) },
      { x: boxSt.x + 5, y: boxEn.y }
    )
  )
    return "left";
  if (
    isPointInBox(
      point,
      { x: boxEn.x - 5, y: boxSt.y },
      { x: boxEn.x + 5, y: boxSt.y + height / 2 - 5 }
    ) ||
    isPointInBox(
      point,
      { x: boxEn.x - 5, y: boxSt.y + (height / 2 + 5) },
      { x: boxEn.x + 5, y: boxEn.y }
    )
  )
    return "right";
  return null;
}
