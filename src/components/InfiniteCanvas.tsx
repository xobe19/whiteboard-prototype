import { Fragment, useEffect, useRef } from "react";
import useWindowSize from "../hooks/useWindowSize";
import store from "../redux/store";
import renderCanvas from "../utils/render/renderCanvas";
import { windowResize, windowSetup } from "../redux/slices/editor/slice";
import { useSelector } from "react-redux";
import { Editor, StoreState } from "../redux/slices/editor/types";

export default function InfiniteCanvas() {
  const htmlCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasWidth = useSelector<StoreState, number>(
    (state) => state.editor.canvas.width
  );
  const canvasHeight = useSelector<StoreState, number>(
    (state) => state.editor.canvas.height
  );
  console.log("render");

  useEffect(() => {
    if (!htmlCanvasRef.current) return;
    let ctx = htmlCanvasRef.current.getContext("2d");
    if (ctx === null) return;
    const canvasState = store.getState().editor.canvas;
    renderCanvas(ctx, canvasState);
    store.subscribe(() => {
      if (ctx === null) return;
      const canvasState = store.getState().editor.canvas;
      renderCanvas(ctx, canvasState);
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
      <canvas
        ref={htmlCanvasRef}
        width={canvasWidth}
        height={canvasHeight}
      ></canvas>
    </Fragment>
  );
}
