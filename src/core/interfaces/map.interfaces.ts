import {MutableRefObject} from 'react'

import {
  AxialCoords,
  CubeCoords,
  ShortCubeCoords
} from '../../contexts/canvas/interfaces'
import {LANDSCAPES} from '../classes/LandscapeTemplates/constants'
import {HEX_TILE_TYPES} from '../classes/HexTileTemplates/constants'

export interface RectMapSchemeRow {
  [key: CubeCoords['q']]: {
    landscapeType: keyof typeof LANDSCAPES
    rotationDeg: number
    isReflected: boolean
  }
}

export interface RectMapScheme {
  [key: CubeCoords['r']]: RectMapSchemeRow
}

export interface MapEdges {
  top: number
  right: number
  bottom: number
  left: number
}

export interface MapEventListener {
  onChangeSelectedHex?: (coords: null | ShortCubeCoords) => void
  onChangeHoveredHex?: (coords: null | ShortCubeCoords) => void
  onChangeCenterHex?: (coords: null | ShortCubeCoords) => void
  onChangeScale?: (scale: number) => void
}

export interface PreparedForRenderHex {
  hexType: keyof typeof HEX_TILE_TYPES
  landscapeType: keyof typeof LANDSCAPES
  rotationDeg: number
  isReflected: boolean
  coords: AxialCoords
}

export interface CanvasObject {
  ref: MutableRefObject<null | HTMLCanvasElement>
  ctx: null | CanvasRenderingContext2D
}

export type MapMode = 'simplified' | 'detailed'
