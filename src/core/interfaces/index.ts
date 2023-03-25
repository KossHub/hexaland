export interface HexCoordinates {
  x: number
  y: number
}

export interface HexObj {
  coords: HexCoordinates
  /** Outer Hex radius */
  radius?: number,
}
