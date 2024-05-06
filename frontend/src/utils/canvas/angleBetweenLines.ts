export function angleBetweenLines(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number) {
  let m1 = (y2-y1)/(x2-x1);
  let m2 = (y3-y1)/(x3-x1);

  return Math.atan((m1-m2)/(1 + m1*m2));
}