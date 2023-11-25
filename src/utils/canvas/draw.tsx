import {  toVirtualX, toVirtualY } from "../../entities/Canvas";
import { CanvasState } from "../../redux/canvasSlice";
import { drawDots } from "./drawDots";

export function draw(
  canvasRef: HTMLCanvasElement,
  canvasContext: CanvasRenderingContext2D,
  state: CanvasState
) {
  canvasContext.clearRect(0, 0, canvasRef.width, canvasRef.height);
  console.log("draw called with scale: " + state.scale);
  console.log(canvasContext);
  let hundred = 100;
  let stX = Math.round(state.vpOriginX / hundred) * hundred;
  let endX = stX + canvasRef.width / state.scale + hundred;
  let stY = Math.round(state.vpOriginY / hundred) * hundred;
  let endY = stY + canvasRef.width / state.scale + hundred;

  drawDots(
    canvasContext,
    toVirtualX(stX, state.vpOriginX, state.scale),
    toVirtualY(stY, state.vpOriginY, state.scale),
    toVirtualX(endX, state.vpOriginX, state.scale),
    toVirtualY(endY, state.vpOriginY, state.scale),
    state.scale
  );
}
