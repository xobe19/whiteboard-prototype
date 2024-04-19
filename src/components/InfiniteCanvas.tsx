import { Fragment, useEffect, useRef } from "react";
import store from "../redux/store";
import renderCanvas from "../utils/render/renderCanvas";
import {
  mouseDown,
  mouseMove,
  mouseUp,
  rightMouseDown,
  rightMouseUp,
  windowResize,
  windowSetup,
} from "../redux/slices/editor/slice";

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

    htmlCanvasRef.current!.addEventListener("contextmenu", (ev) => {
      ev.preventDefault();
    });
    htmlCanvasRef.current!.addEventListener("mousemove", (ev: MouseEvent) => {
      ev.preventDefault();
      console.log("mousemoved");
      store.dispatch(
        mouseMove({
          deltaX: ev.movementX,
          deltaY: ev.movementY,
          virtualX: ev.x,
          virtualY: ev.y,
        })
      );
    });

    htmlCanvasRef.current!.addEventListener("mousedown", (ev: MouseEvent) => {
      ev.preventDefault();
      console.log("md", ev.button);
      switch (ev.button) {
        case 0:
          store.dispatch(mouseDown({ virtualX: ev.x, virtualY: ev.y }));
          break;
        case 2:
          console.log("md22");
          store.dispatch(rightMouseDown({ virtualX: ev.x, virtualY: ev.y }));
          break;
      }
    });

    htmlCanvasRef.current!.addEventListener("mouseup", (ev) => {
      ev.preventDefault();
      switch (ev.button) {
        case 0:
          store.dispatch(mouseUp({ virtualX: ev.x, virtualY: ev.y }));
          break;
        case 2:
          store.dispatch(rightMouseUp());
          break;
      }
    });
  }, []);

  return (
    <Fragment>
      <canvas ref={htmlCanvasRef}></canvas>
    </Fragment>
  );
}
