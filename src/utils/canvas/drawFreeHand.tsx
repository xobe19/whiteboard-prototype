
export function drawFreeHand(c: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, rot: number, points: {x: number, y: number}[]) {

  c.translate(x, y);
  c.rotate(rot);

  drawCurve(c, points.map((pnt) => {return {x: pnt.x - x, y: pnt.y - y}}), 1);

  c.rotate(-rot);
  c.translate(-x, -y);



}

function drawCurve(ctx: CanvasRenderingContext2D, points: {x: number, y: number}[], tension: number) {
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);

    var t = (tension != null) ? tension : 1;
    for (var i = 0; i < points.length - 1; i++) {
        var p0 = (i > 0) ? points[i - 1] : points[0];
        var p1 = points[i];
        var p2 = points[i + 1];
        var p3 = (i != points.length - 2) ? points[i + 2] : p2;

        var cp1x = p1.x + (p2.x - p0.x) / 6 * t;
        var cp1y = p1.y + (p2.y - p0.y) / 6 * t;

        var cp2x = p2.x - (p3.x - p1.x) / 6 * t;
        var cp2y = p2.y - (p3.y - p1.y) / 6 * t;

        ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, p2.x, p2.y);
    }
    ctx.stroke();
}
