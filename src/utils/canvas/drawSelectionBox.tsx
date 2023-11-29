import { Point } from "../../entities/Point";
import { Shape } from "../../entities/Shape";
import { drawRect } from "./drawRect";
import { rotateCoordinates } from "./rotateCoordinates";

export function drawSelectionBox(c: CanvasRenderingContext2D, boxSt: Point, width: number, height: number, rot: number) {

  console.log("drawing selection box");


    let {x, y} = boxSt;

    c.strokeStyle = "purple";
    drawRect(c, x, y, width, height, rot);
    c.strokeStyle = "black";

    let dots: Point[] = [{x: x + width/2, y: y}, {x: x + width/2, y: y + height}, {x: x, y: y + height/2}, {x: x+ width, y: y + height/2}];

    dots = dots.map((point) => rotateCoordinates({x, y}, point, -rot));

    dots.forEach((point) => {
      c.beginPath();
      c.arc(point.x, point.y, 5, 0, Math.PI*2);
      c.stroke();
    });

}