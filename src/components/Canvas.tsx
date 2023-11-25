import useWindowSize from "../hooks/useWindowSize";
import { useRef, useEffect } from "react";
import { changeScale, shiftOriginX, shiftOriginY } from "../redux/canvasSlice";
import { useDispatch } from "react-redux/es/hooks/useDispatch";
import { subscribeToStore } from "../utils/canvas/subscribeToStore";

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
      }}
      onMouseMove={(evt) => {
        if (rightClick.current) {
          let deltaX = evt.movementX;
          let deltaY = evt.movementY;
          dispatch(shiftOriginX(deltaX));
          dispatch(shiftOriginY(deltaY));
        }
      }}
      onMouseUp={(evt) => {
        evt.preventDefault();
        if (evt.button === 2) {
          rightClick.current = false;
        }
      }}
      onContextMenu={(evt) => evt.preventDefault()}
      onWheel={(evt) => {
        let deltaY = evt.deltaY;
        let sensitivityInverse = 1000;
        dispatch(changeScale(deltaY/sensitivityInverse))
      }}
    ></canvas>
  );
}

export default Canvas;
