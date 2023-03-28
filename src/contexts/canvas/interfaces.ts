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

export interface MapEdges {
  top: number
  right: number
  bottom: number
  left: number
}
