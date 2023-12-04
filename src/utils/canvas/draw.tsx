import { toVirtualX, toVirtualY } from "../../entities/Canvas";
import { CanvasState, ShapeState } from "../../redux/types";
import { drawCircle } from "./drawCircle";
import { drawDots } from "./drawDots";
import { drawFreeHand } from "./drawFreeHand";
import { drawRect } from "./drawRect";
import { drawSelectionBox } from "./drawSelectionBox";
import { drawTriangle } from "./drawTriangle";

function drawShapes(
  c: CanvasRenderingContext2D,
  shapes: ShapeState[],
  state: CanvasState
) {
  for (let shape of shapes) {
    let params: [number, number, number, number, number] = [
      toVirtualX(shape.x, state.vpOriginX, state.scale),
      toVirtualY(shape.y, state.vpOriginY, state.scale),
      shape.width * state.scale,
      shape.height * state.scale,
      shape.rotatedRadians,
    ];

    if (shape.type == "crcl") {
      drawCircle(c, ...params);
    } else if (shape.type == "trng") {
      drawTriangle(c, ...params);
    } else if (shape.type == "rect") {
      drawRect(c, ...params);
    } else {
      drawFreeHand(
        c,
        ...params,
        shape.points.map((pnt) => {
          return {
            x: toVirtualX(pnt.x, state.vpOriginX, state.scale),
            y: toVirtualY(pnt.y, state.vpOriginY, state.scale),
          };
        })
      );
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

  console.log("shape drawing on: ");

  drawShapes(canvasContext, state.shapes, state);

  for (let i = 0; i < state.shapes.length; i++) {
    if (state.shapes[i].selected) {
      console.log("selection drawing on:");
      drawSelectionBox(
        canvasContext,
        {
          x: toVirtualX(state.shapes[i].x, state.vpOriginX, state.scale),
          y: toVirtualY(state.shapes[i].y, state.vpOriginY, state.scale),
        },
        state.shapes[i].width * state.scale,
        state.shapes[i].height * state.scale,
        state.shapes[i].rotatedRadians
      );
      break;
    }
  }

  canvasContext.lineWidth = origLW;
}
