import useWindowSize from "../hooks/useWindowSize";
import { useRef, useEffect } from "react";
import {
  addShape,
  changeScale,
  shiftOriginX,
  shiftOriginY,
} from "../redux/canvasSlice";
import { useDispatch } from "react-redux/es/hooks/useDispatch";
import { subscribeToStore } from "../utils/canvas/subscribeToStore";
import {  drawFreeHandLive } from "../utils/canvas/drawFreeHand";
import { getMinCoOrdinates } from "../utils/canvas/getMinCoOrdinates";
import { getMaxCoOrdinates } from "../utils/canvas/getMaxCoOrdinates";

function Canvas() {
  const [height, width] = useWindowSize();
  const canvasRef: React.MutableRefObject<HTMLCanvasElement | null> =
    useRef(null);
  const canvasContext: React.MutableRefObject<null | CanvasRenderingContext2D> =
    useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    canvasContext.current = canvasRef.current!.getContext("2d");
    subscribeToStore(canvasRef.current!, canvasContext.current!);
  }, []);

  const rightClick = useRef(false);
  const leftClick = useRef(false);
  const shapeInConstruction: React.MutableRefObject<Shape> = useRef({
    x: 0,
    y: 0,
    backgroundColor: "#000000",
    height: 0,
    width: 0,
    noteSafeHeight: 0,
    noteSafeWidth: 0,
    rotatedRadians: 0,
    type: "free",
    noteSafeX: 0,
    noteSafeY: 0,
    points: [],
  });
  const drawingMode: React.MutableRefObject<
    "drawing" | "creatingShape" | "select" | "dragging" | "rotating"
  > = useRef("drawing");

  return (
    <canvas
      width={width}
      height={height}
      className="overflow-hidden bg-white"
      ref={canvasRef}
      onMouseDown={(evt) => {
        evt.preventDefault();
        if (evt.button === 2) {
          rightClick.current = true;
        }
        if (evt.button === 0) {
          leftClick.current = true;
          if (drawingMode.current === "drawing") {
            shapeInConstruction.current.points = [
              { x: evt.clientX, y: evt.clientY },
            ];
          } else if (drawingMode.current === "creatingShape") {
            shapeInConstruction.current.x = evt.clientX;
            shapeInConstruction.current.y = evt.clientY;
          }
        }
      }}
      onMouseMove={(evt) => {
        if (rightClick.current) {
          let deltaX = evt.movementX;
          let deltaY = evt.movementY;
          dispatch(shiftOriginX(deltaX));
          dispatch(shiftOriginY(deltaY));
        }
        if (leftClick.current) {
          if (drawingMode.current === "drawing") {
            let prev =
              shapeInConstruction.current.points[
                shapeInConstruction.current.points.length - 1
              ];
            if (prev.x != evt.clientX && prev.y != evt.clientY) {
              shapeInConstruction.current.points.push({
                x: evt.clientX,
                y: evt.clientY,
              });
            }
            if (canvasContext.current != null) {
              drawFreeHandLive(canvasContext.current, shapeInConstruction.current.points)
                        }
          } else if (drawingMode.current === "creatingShape") {
            shapeInConstruction.current.width =
              evt.clientX - shapeInConstruction.current.x;
            shapeInConstruction.current.height =
              evt.clientY - shapeInConstruction.current.y;
          }
        }
      }}
      onMouseUp={(evt) => {
        evt.preventDefault();
        if (evt.button === 2) {
          rightClick.current = false;
        }
        if (evt.button === 0) {
          leftClick.current = false;
          if (drawingMode.current === "drawing") {
            let minC = getMinCoOrdinates(shapeInConstruction.current.points);
            let maxC = getMaxCoOrdinates(shapeInConstruction.current.points);

            shapeInConstruction.current.x = minC.x;
            shapeInConstruction.current.y = minC.y;

            shapeInConstruction.current.width = maxC.x - minC.x;
            shapeInConstruction.current.height = maxC.y - minC.y;

            shapeInConstruction.current.x -= 20;
            shapeInConstruction.current.y -= 20;
            shapeInConstruction.current.width += 20;
            shapeInConstruction.current.height += 20;

            console.log("added shape");
            dispatch(addShape(shapeInConstruction.current));
          } else if (drawingMode.current === "creatingShape") {
            shapeInConstruction.current.width =
              evt.clientX - shapeInConstruction.current.x;
            shapeInConstruction.current.height =
              evt.clientY - shapeInConstruction.current.y;
          }
        }
      }}
      onContextMenu={(evt) => evt.preventDefault()}
      onWheel={(evt) => {
        let deltaY = evt.deltaY;
        let sensitivityInverse = 1000;
        dispatch(changeScale(deltaY / sensitivityInverse));
      }}
    ></canvas>
  );
}

export default Canvas;
