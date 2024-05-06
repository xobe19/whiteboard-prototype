import { Canvas } from "../../redux/slices/editor/types";
import {
  ceilToNearestMultiple,
  floorToNearestMultiple,
  getVirtualDistance,
  getVirtualPoint,
} from "../../redux/slices/editor/utils";

export default function renderBackgroundDots(
  ctx: CanvasRenderingContext2D,
  canvasState: Canvas
) {
  const POINT_DISTANCE = 50;
  const VIRTUAL_POINT_DISTANCE = getVirtualDistance(
    POINT_DISTANCE,
    canvasState.zoom
  );

  let tlR = {
    realX: floorToNearestMultiple(canvasState.b.realX, POINT_DISTANCE),
    realY: ceilToNearestMultiple(canvasState.b.realY, POINT_DISTANCE),
  };
  let brR = {
    realX: ceilToNearestMultiple(tlR.realX + canvasState.width, POINT_DISTANCE),
    realY: floorToNearestMultiple(
      tlR.realY - canvasState.height,
      POINT_DISTANCE
    ),
  };

  //adding buffer of 50px

  tlR.realX -= 500;
  tlR.realY += 500;

  brR.realX += 500;
  brR.realY -= 500;

  for (let x = tlR.realX; x <= brR.realX; x += VIRTUAL_POINT_DISTANCE) {
    for (let y = tlR.realY; y >= brR.realY; y -= VIRTUAL_POINT_DISTANCE) {
      let virtualPoint = getVirtualPoint(
        canvasState.b,
        { realX: x, realY: y },
        canvasState.zoom
      );
      ctx.beginPath();
      ctx.arc(
        virtualPoint.virtualX,
        virtualPoint.virtualY,
        getVirtualDistance(1, canvasState.zoom),
        0,
        2 * Math.PI,
        true
      );
      ctx.fill();
    }
  }
}
