import { Shape } from "../../entities/Shape";

export function emptyShapeObjectFactory(): Shape {
  return {
    x: 0,
    y: 0,
    backgroundColor: "#000000",
    height: 0,
    width: 0,
    noteSafeHeight: 0,
    noteSafeWidth: 0,
    rotatedRadians: 0,
    type: "free",
    noteSafeX: 0,
    noteSafeY: 0,
    points: [],
    selected : false
  };
}