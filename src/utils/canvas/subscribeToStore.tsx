import store from "../../redux/store";
import { setRendered } from "../../redux/canvasSlice";
import { draw } from "./draw";

export function subscribeToStore(
  canvasRef: HTMLCanvasElement,
  canvasContext: CanvasRenderingContext2D
) {
  draw(canvasRef, canvasContext, store.getState().canvas);
  store.subscribe(() => {
    let state = store.getState();
    if (!state.canvas.rendered) {
      draw(canvasRef, canvasContext, state.canvas);
      store.dispatch(setRendered(true));
    }
  });
}
