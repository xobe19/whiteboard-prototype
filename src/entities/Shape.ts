import { Point } from "./Point";

export interface Shape {
  type: "crcl" | "rect" | "trng" | "free",
  backgroundColor: string,
  x: number,
  y: number,
  width: number,
  height: number,
  noteSafeX: number,
  noteSafeY: number,
  noteSafeWidth: number,
  noteSafeHeight: number,
  rotatedRadians: number,
  points: Point[],
  selected: boolean,
  interacting: boolean 
}