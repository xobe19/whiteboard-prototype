export function drawRect(c: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, rot: number) {


  c.beginPath();
  c.moveTo(x, y);
  c.lineTo(x + Math.sin(rot) * height, y + Math.cos(rot) * height);
  c.lineTo(x + Math.sin(rot) * height + Math.cos(rot) * width, y + height * Math.cos(rot) - width * Math.sin(rot));
  c.lineTo(x + Math.cos(rot) * width, y - width * Math.sin(rot));
  c.lineTo(x, y);
  c.stroke();


}
