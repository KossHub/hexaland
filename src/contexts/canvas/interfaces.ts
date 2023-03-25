import {PositionXY} from '../../interfaces'

export interface CanvasContextState {
  ref: null | HTMLCanvasElement
  ctx: null | CanvasRenderingContext2D
  cursorPos: PositionXY
}
