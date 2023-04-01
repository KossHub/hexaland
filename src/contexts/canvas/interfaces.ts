export interface AxialCoords {
  x: number
  y: number
}

export interface CubeCoords {
  q: number
  r: number
  s: number
}

export type ShortCubeCoords = Omit<CubeCoords, 's'>

export interface CanvasContextState {
  ref: null | HTMLCanvasElement
  ctx: null | CanvasRenderingContext2D
  scale: number
  originOffset: AxialCoords
}

export interface MapEdgesInPixels {
  top: number
  right: number
  bottom: number
  left: number
}
