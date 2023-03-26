interface mouseState {
  x: number
  y: number
  prevX: number
  prevY: number
  isButtonPressed: boolean
}

export interface Position2D {
  x: number
  y: number
}

export interface CanvasContextState {
  ref: null | HTMLCanvasElement
  ctx: null | CanvasRenderingContext2D
  scale: number
  mouseState: mouseState
  originOffset: Position2D
  isUpdateRequired: boolean
}

export type CanvasObj = Pick<CanvasContextState, 'ref' | 'ctx'>
