import { Canvas } from "../../redux/slices/editor/types";
import {
  getVirtualDistance,
  getVirtualPoint,
} from "../../redux/slices/editor/utils";

export default function renderBackgroundDots(
  ctx: CanvasRenderingContext2D,
  canvasState: Canvas
) {
  let tlR = {
    realX: Math.floor(canvasState.b.realX),
    realY: Math.ceil(canvasState.b.realY),
  };
  let brR = {
    realX: Math.ceil(tlR.realX + canvasState.width),
    realY: Math.floor(tlR.realY - canvasState.height),
  };

  //adding buffer of 50px

  tlR.realX -= 50;
  tlR.realY += 50;

  brR.realX += 50;
  brR.realY -= 50;

  const virtualPointDistance = getVirtualDistance(30, canvasState.zoom);

  for (let x = tlR.realX; x <= brR.realX; x += virtualPointDistance) {
    for (let y = tlR.realY; y >= brR.realY; y -= virtualPointDistance) {
      let virtualPoint = getVirtualPoint(
        canvasState.b,
        { realX: x, realY: y },
        canvasState.zoom
      );
      console.log("drawn point");
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
