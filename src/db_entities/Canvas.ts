import { SolidShape } from "./SolidShape";
import { FreeDrawnShape } from "./FreeDrawnShape";

export interface Canvas {
  id: string;
  shapes: (SolidShape | FreeDrawnShape)[];
}
