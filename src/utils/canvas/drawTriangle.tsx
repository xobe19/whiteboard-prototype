export function drawTriangle(
  c: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  rot: number
) {
  c.translate(x, y);
  c.rotate(rot);

  c.beginPath();
  c.moveTo(0, height);
  c.lineTo(width, height * Math.cos(rot));
  c.lineTo(width / 2, 0);
  c.lineTo(0, height);
  c.stroke();

  c.rotate(-rot);
  c.translate(-x, -y);
}
