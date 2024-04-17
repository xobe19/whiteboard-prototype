import { Fragment, useEffect, useRef } from "react";
import useWindowSize from "../hooks/useWindowSize";
import store from "../redux/store";
import renderCanvas from "../utils/render/renderCanvas";

export default function InfiniteCanvas() {
  const htmlCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const windowSize = useWindowSize();
  console.log("render");

  useEffect(() => {
    if (!htmlCanvasRef.current) return;
    let ctx = htmlCanvasRef.current.getContext("2d");
    store.subscribe(() => {
      if (ctx === null) return;
      const canvasState = store.getState().editor.canvas;
      renderCanvas(ctx, canvasState);
    });
  }, []);

  return (
    <Fragment>
      <canvas
        ref={htmlCanvasRef}
        width={windowSize.width}
        height={windowSize.height}
      ></canvas>
    </Fragment>
  );
}
