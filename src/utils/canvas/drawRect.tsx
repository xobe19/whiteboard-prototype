export function drawRect(c: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, rot: number) {

  console.log(x, y);

  c.translate(x, y);
  c.rotate(rot);

  c.beginPath();
  c.moveTo(0, 0);
  c.lineTo(0, height);
  c.lineTo( width, height );
  c.lineTo(  width, 0);
  c.lineTo(0, 0);
  c.stroke();

  c.rotate(-rot);
  c.translate(-x, -y);


}
