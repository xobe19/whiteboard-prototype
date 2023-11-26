import {  toVirtualX, toVirtualY } from "../../entities/Canvas";
import { CanvasState } from "../../redux/canvasSlice";
import { drawDots } from "./drawDots";



function drawCircle( c: CanvasRenderingContext2D, x : number, y : number, width: number, height: number, rot: number) {

  c.beginPath();

  c.ellipse(x + width/2, y +height/2 , width/2, height/2, 0, 0, Math.PI*2);
  c.stroke();
}

function drawRect(c: CanvasRenderingContext2D, x : number, y: number, width: number, height: number,rot: number) {
  c.beginPath();
  c.moveTo(x, y);
  c.lineTo(x + Math.sin(rot)*height, y + Math.cos(rot)*height);
  c.lineTo(x + Math.sin(rot)*height + Math.cos(rot)*width, y + height*Math.cos(rot) - width*Math.sin(rot));
  c.lineTo(x + Math.cos(rot)*width,y  - width*Math.sin(rot));
  c.lineTo(x, y);

  c.stroke();
}

function drawTriangle(c: CanvasRenderingContext2D, x : number, y: number, width: number, height: number, rot: number) {
  c.beginPath();
  c.moveTo(x + height*Math.sin(rot), y + height*Math.cos(rot));
  c.lineTo(x + Math.sin(rot)*height + Math.cos(rot)*width, y + height*Math.cos(rot) - width*Math.sin(rot));
  c.lineTo(x + (width/2)*Math.cos(rot), y - (width/2)*Math.sin(rot));
  c.lineTo(x + height*Math.sin(rot), y + height*Math.cos(rot));
  c.stroke();

}



function drawShapes( c: CanvasRenderingContext2D, shapes: Shape[], state: CanvasState) {
  for(let shape of shapes) {
    c.setTransform(1, 0, 0, 1, 0, 0);
    drawTriangle( c, toVirtualX(shape.x, state.vpOriginX, state.scale), toVirtualY(shape.x, state.vpOriginY, state.scale), (shape.width)*(state.scale), (shape.height)*(state.scale), shape.rotatedRadians);
    drawRect( c, toVirtualX(shape.x, state.vpOriginX, state.scale), toVirtualY(shape.x, state.vpOriginY, state.scale), (shape.width)*(state.scale), (shape.height)*(state.scale), shape.rotatedRadians);
    drawCircle( c, toVirtualX(shape.x, state.vpOriginX, state.scale), toVirtualY(shape.x, state.vpOriginY, state.scale), (shape.width)*(state.scale), (shape.height)*(state.scale), shape.rotatedRadians);
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
