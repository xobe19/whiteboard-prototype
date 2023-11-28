export function drawCircle(c: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, rot: number) {
  c.translate(x, y);
  c.rotate(rot);

  c.beginPath();
  c.ellipse(width / 2, height / 2, width / 2, height / 2, 0, 0, Math.PI * 2);
  c.stroke();

  c.rotate(-rot);
  c.translate(-x, -y);

}
