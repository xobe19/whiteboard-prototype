export function drawTriangle(c: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, rot: number) {
  c.beginPath();
  c.moveTo(x + height * Math.sin(rot), y + height * Math.cos(rot));
  c.lineTo(x + Math.sin(rot) * height + Math.cos(rot) * width, y + height * Math.cos(rot) - width * Math.sin(rot));
  c.lineTo(x + (width / 2) * Math.cos(rot), y - (width / 2) * Math.sin(rot));
  c.lineTo(x + height * Math.sin(rot), y + height * Math.cos(rot));
  c.stroke();
}
