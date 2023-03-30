export interface AxialCoordinates {
  x: number
  y: number
}

export interface CubeCoordinates {
  q: number
  r: number
  s: number
}

export type ShortCubeCoordinates = Omit<CubeCoordinates, 's'>

export interface CanvasContextState {
  ref: null | HTMLCanvasElement
  ctx: null | CanvasRenderingContext2D
  scale: number
  originOffset: AxialCoordinates
}

export interface MapEdgesInPixels {
  top: number
  right: number
  bottom: number
  left: number
}
