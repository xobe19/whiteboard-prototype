import { configureStore } from "@reduxjs/toolkit";
import { canvasReducer } from "./canvasSlice";

const store = configureStore({reducer: {canvas: canvasReducer}});

export default store;