import { configureStore } from "@reduxjs/toolkit";
import { editorReducer } from "./slices/editor/slice";

const store = configureStore({ reducer: { editor: editorReducer } });

export default store;
