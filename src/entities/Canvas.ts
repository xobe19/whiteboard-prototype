export interface Canvas {
  shapes: Shape[],
  vpOriginX: number,
  vpOriginY: number,
  scale: number,
 // TODO: arrows: Arrow[]
}

export function toVirtualX(realX : number, vpOriginX : number, scale : number) {
  return (realX - vpOriginX) * scale;
}

export function toVirtualY(realY : number, vpOriginY : number, scale: number) {
  return (realY - vpOriginY) * scale;
}

export function toRealX(virtualX : number, vpOriginX : number, scale : number) {
  return (virtualX/scale) + vpOriginX;
}

export function toRealY(virtualY: number, vpOriginY: number, scale: number) {
  return (virtualY/scale) + vpOriginY;
}
