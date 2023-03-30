export interface RectMapSize {
  width: number
  height: number
}

export type RectMapCubeCoords = [
  number, // r
  number // q
]

export interface RectMapEdgesCubeCoords {
  top: number
  right: number
  bottom: number
  left: number
}
