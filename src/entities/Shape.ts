interface Shape {
  type: "crcl" | "plgm" | "rect" | "trng" | "star",
  backgroundColor: string,
  id: string,
  x: number,
  y: number,
  width: number,
  height: number,
  noteSafeX: number,
  noteSafeY: number,
  noteSafeWidth: number,
  noteSafeHeight: number,
  rotatedRadians: number
}