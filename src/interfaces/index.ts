import {OptionsWithExtraProps, SnackbarOrigin, VariantType} from 'notistack'

export interface TextForm {
  [key: string]: string
}

export interface PositionXY {
  x: number
  y: number
}

export interface CanvasObj {
  ref: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  cursorPos: PositionXY
}

export interface NotificationPosition {
  TOP: SnackbarOrigin
  BOTTOM: SnackbarOrigin
}

export interface EnqueueSnackbarOptions
  extends OptionsWithExtraProps<VariantType> {
  onlyBottom?: boolean
}
