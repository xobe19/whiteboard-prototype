export function getMaxCoOrdinates(points: { x: number; y: number; }[]) {
  let maxX = points[0].x, maxY = points[0].y;
  for (let i = 1; i < points.length; i++) {
    maxX = Math.max(points[i].x, maxX);
    maxY = Math.max(points[i].y, maxY);
  }
  return { x: maxX, y: maxY };
}
