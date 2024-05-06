import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux/es/hooks/useDispatch";
import { Shape } from "../entities/Shape";
import useWindowSize from "../hooks/useWindowSize";
import {
  addShape,
  changeScale,
  deselectIfOutOfBounds,
  mouseMovementEnded,
  selectShape,
  selectedMouseMove,
  shiftOriginX,
  shiftOriginY,
} from "../redux/slices/canvasSlice";
import { DrawingMode } from "../redux/types";
import { drawFreeHandLive } from "../utils/canvas/drawFreeHand";
import { emptyShapeStateObjectFactory } from "../utils/canvas/emptyShapeObjectFactory";
import { getMaxCoOrdinates } from "../utils/canvas/getMaxCoOrdinates";
import { getMinCoOrdinates } from "../utils/canvas/getMinCoOrdinates";
import { subscribeToStore } from "../utils/canvas/subscribeToStore";

function Canvas() {
  const [height, width] = useWindowSize();
  const canvasRef: React.MutableRefObject<HTMLCanvasElement | null> =
    useRef(null);
  const canvasContext: React.MutableRefObject<null | CanvasRenderingContext2D> =
    useRef(null);
  const drawingMode: React.MutableRefObject<DrawingMode> = useRef("select");
  const dispatch = useDispatch();
  const drawingModeListenerCallback = useRef((newDrawingMode: DrawingMode) => {
    drawingMode.current = newDrawingMode;
  });

  useEffect(() => {
    canvasContext.current = canvasRef.current!.getContext("2d");
    subscribeToStore(
      canvasRef.current!,
      canvasContext.current!,
      drawingModeListenerCallback.current
    );
    window.addEventListener("keydown", () => {
      ctrlPressed.current = true;
    });
    window.addEventListener("keyup", () => {
      ctrlPressed.current = false;
    });
  }, []);

  const rightClick = useRef(false);
  const leftClick = useRef(false);
  const ctrlPressed = useRef(false);
  const shapeInConstruction: React.MutableRefObject<Shape> = useRef(
    emptyShapeStateObjectFactory()
  );

  const selectedShape: React.MutableRefObject<Shape> = useRef(
    emptyShapeStateObjectFactory()
  );

  return (
    <canvas
      width={width}
      height={height}
      className="overflow-hidden bg-white fixed top-0 left-0"
      ref={canvasRef}
      onMouseDown={(evt) => {
        evt.preventDefault();
        let cx = evt.clientX;
        let cy = evt.clientY;
        if (evt.button === 2) {
          rightClick.current = true;
        }
        if (evt.button === 0) {
          leftClick.current = true;
          if (drawingMode.current === "select") {
            dispatch(selectShape({ x: cx, y: cy }));
          } else if (drawingMode.current === "selected") {
            dispatch(deselectIfOutOfBounds({ x: cx, y: cy }));
          } else if (drawingMode.current === "drawing") {
            shapeInConstruction.current.points = [{ x: cx, y: cy }];
          } else if (drawingMode.current === "creatingShape") {
            shapeInConstruction.current.x = cx;
            shapeInConstruction.current.y = cy;
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
              drawFreeHandLive(
                canvasContext.current,
                shapeInConstruction.current.points
              );
            }
          } else if (drawingMode.current === "creatingShape") {
            shapeInConstruction.current.width =
              evt.clientX - shapeInConstruction.current.x;
            shapeInConstruction.current.height =
              evt.clientY - shapeInConstruction.current.y;
          } else if (drawingMode.current === "selected") {
            dispatch(
              selectedMouseMove({
                movement: { x: evt.movementX, y: evt.movementY },
                point: { x: evt.clientX, y: evt.clientY },
                rotate: ctrlPressed.current,
              })
            );
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
          } else if (drawingMode.current === "selected") {
            dispatch(mouseMovementEnded());
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
