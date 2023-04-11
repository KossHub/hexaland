import {CubeCoords} from '../../contexts/canvas/interfaces'
import {LANDSCAPE_TYPES} from '../classes/LandscapeTemplates/constants'

export interface RectMapSchemeRow {
  [key: CubeCoords['q']]: {
    landscape: keyof typeof LANDSCAPE_TYPES
    rotationDeg?: number
    reflected?: boolean
  }
}

export interface RectMapScheme {
  [key: CubeCoords['r']]: RectMapSchemeRow
}

export interface RectMapInitData {
  top: number
  right: number
  bottom: number
  left: number
}
