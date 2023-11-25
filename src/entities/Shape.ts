interface Shape {
  type: "crcl" | "oval" | "plgm" | "rect" | "trng" | "star",
  backgroundColor: String,
  id: String,
  x: Number,
  y: Number,
  width: Number,
  height: Number,
  noteSafeX: Number,
  noteSafeY: Number,
  noteSafeWidth: Number,
  noteSafeHeight: Number
}