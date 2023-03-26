import {Position2D} from '../../contexts/canvas/interfaces'

export interface HexObj {
  coords: Position2D
  /** Outer Hex radius */
  radius?: number
}
