import { useSelector as uS } from "react-redux/es/exports";
import { ReduxStore } from "./types";

export const useSelector = <T>(fn: (state: ReduxStore) => T) => uS(fn) ; 