export function drawCircle(c: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, rot: number) {
  c.beginPath();
  c.ellipse(x + width / 2, y + height / 2, width / 2, height / 2, 0, 0, Math.PI * 2);
  c.stroke();
}
