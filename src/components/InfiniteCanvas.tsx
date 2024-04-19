import { Fragment, useEffect, useRef } from "react";
import store from "../redux/store";
import renderCanvas from "../utils/render/renderCanvas";
import { windowResize, windowSetup } from "../redux/slices/editor/slice";

export default function InfiniteCanvas() {
  const htmlCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const currentCanvasWidth = useRef(0);
  const currentCanvasHeight = useRef(0);

  console.log("react render");

  useEffect(() => {
    let ctx = htmlCanvasRef.current!.getContext("2d");
    store.subscribe(() => {
      const canvasState = store.getState().editor.canvas;
      if (
        canvasState.width !== currentCanvasWidth.current ||
        canvasState.height !== currentCanvasHeight.current
      ) {
        htmlCanvasRef.current!.width = currentCanvasWidth.current =
          canvasState.width;
        htmlCanvasRef.current!.height = currentCanvasHeight.current =
          canvasState.height;
      }
      renderCanvas(ctx!, canvasState);
    });
    store.dispatch(
      windowSetup({ height: window.innerHeight, width: window.innerWidth })
    );
    window.addEventListener("resize", () => {
      store.dispatch(
        windowResize({ height: window.innerHeight, width: window.innerWidth })
      );
    });
  }, []);

  return (
    <Fragment>
      <canvas ref={htmlCanvasRef}></canvas>
    </Fragment>
  );
}
