export interface Position2D {
  x: number
  y: number
}

export interface CanvasContextState {
  ref: null | HTMLCanvasElement
  ctx: null | CanvasRenderingContext2D
  scale: number
  originOffset: Position2D
}
