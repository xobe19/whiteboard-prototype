export function getMinCoOrdinates(points: { x: number; y: number; }[]) {
  let minX = points[0].x, minY = points[0].y;
  for (let i = 1; i < points.length; i++) {
    minX = Math.min(points[i].x, minX);
    minY = Math.min(points[i].y, minY);
  }
  return { x: minX, y: minY };
}
