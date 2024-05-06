import store from "../../redux/store";
import { setRendered } from "../../redux/canvasSlice";
import { draw } from "./draw";
import { DrawingMode } from "../../redux/types";

export function subscribeToStore(
  canvasRef: HTMLCanvasElement,
  canvasContext: CanvasRenderingContext2D,
  drawingModeChangeListener: (newDrawingMode: DrawingMode) => void
) {
  let oldDrawingMode = store.getState().canvas.drawingMode;
  let oldCtrlState = false;
  draw(canvasRef, canvasContext, store.getState().canvas);
  store.subscribe(() => {
    let state = store.getState();
    if (!state.canvas.rendered) {
      draw(canvasRef, canvasContext, state.canvas);
      store.dispatch(setRendered(true));
    }
    if (state.canvas.drawingMode != oldDrawingMode) {
      drawingModeChangeListener(state.canvas.drawingMode);
      oldDrawingMode = state.canvas.drawingMode;
    }
  });
}
