import {useRef} from 'react'
import {ZERO_SHORT_CUBE_COORDS} from '../../constants'

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

export interface CanvasRefs {
  grid: null | HTMLCanvasElement
  landscape: null | HTMLCanvasElement
}

export interface CanvasContexts {
  grid: null | CanvasRenderingContext2D
  landscape: null | CanvasRenderingContext2D
}

export interface CanvasContextState {
  wrapperRef: null | HTMLDivElement
  refs: CanvasRefs
  contexts: CanvasContexts
  scale: number
  originOffset: AxialCoords
}

export interface MapEdgesInPixels {
  top: number
  right: number
  bottom: number
  left: number
}
