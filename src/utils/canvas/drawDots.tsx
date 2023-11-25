export function drawDots(
  c: CanvasRenderingContext2D,
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  scale: number
) {
  c.fillStyle = "rgba(128, 128, 128, 0.5)";
  for (let i = startX; i <= endX; i += 50 * scale) {
    for (let j = startY; j <= endY; j += 50 * scale) {
      c.beginPath();
      c.arc(i, j, 2 * scale, 0, 2 * Math.PI);
      c.fill();
    }
  }
}
