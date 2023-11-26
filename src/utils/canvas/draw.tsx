import {  toVirtualX, toVirtualY } from "../../entities/Canvas";
import { CanvasState } from "../../redux/canvasSlice";
import { drawCircle } from "./drawCircle";
import { drawDots } from "./drawDots";
import { drawFreeHand } from "./drawFreeHand";
import { drawRect } from "./drawRect";
import { drawTriangle } from "./drawTriangle";


function drawShapes( c: CanvasRenderingContext2D, shapes: Shape[], state: CanvasState) {
  for(let shape of shapes) {
    if(shape.type == "crcl") {
    drawCircle( c, toVirtualX(shape.x, state.vpOriginX, state.scale), toVirtualY(shape.x, state.vpOriginY, state.scale), (shape.width)*(state.scale), (shape.height)*(state.scale), shape.rotatedRadians);
    }
    else if(shape.type == "trng") {
    drawTriangle( c, toVirtualX(shape.x, state.vpOriginX, state.scale), toVirtualY(shape.x, state.vpOriginY, state.scale), (shape.width)*(state.scale), (shape.height)*(state.scale), shape.rotatedRadians);
    }
    else if(shape.type == "rect") {
    drawRect( c, toVirtualX(shape.x, state.vpOriginX, state.scale), toVirtualY(shape.x, state.vpOriginY, state.scale), (shape.width)*(state.scale), (shape.height)*(state.scale), shape.rotatedRadians);
    }
    else {
      drawFreeHand(c, toVirtualX(shape.x, state.vpOriginX, state.scale), toVirtualY(shape.y, state.vpOriginY, state.scale), (shape.width)*(state.scale), (shape.height)*(state.scale), shape.rotatedRadians, shape.points.map((pnt) => {return {x: toVirtualX(pnt.x, state.vpOriginX, state.scale),y: toVirtualY(pnt.y, state.vpOriginY, state.scale)}}));
    }

  }
}

export function draw(
  canvasRef: HTMLCanvasElement,
  canvasContext: CanvasRenderingContext2D,
  state: CanvasState
) {
  canvasContext.clearRect(0, 0, canvasRef.width, canvasRef.height);
  let origLW = state.scale;
  canvasContext.lineWidth *= state.scale;
  console.log("draw called with scale: " + state.scale);
  console.log(state.shapes);
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


  drawShapes( canvasContext, state.shapes, state)

  canvasContext.lineWidth = origLW
}
