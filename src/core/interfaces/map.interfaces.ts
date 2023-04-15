import {AxialCoords, CubeCoords, ShortCubeCoords} from '../../contexts/canvas/interfaces'
import {LANDSCAPE_TYPES} from '../classes/LandscapeTemplates/constants'
import {HEX_TILE_TYPES} from '../classes/HexTileTemplates/constants'
import {HexDrawnTypes} from "./hex.interfaces";

export interface RectMapSchemeRow {
  [key: CubeCoords['q']]: {
    landscapeType: keyof typeof LANDSCAPE_TYPES
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
  onChangeSelectedHex?: () => null | ShortCubeCoords
  onChangeCenterHex?: () => null | ShortCubeCoords
  onChangeScale?: () => number
}

export interface PreparedForRenderHex {
  hexType: keyof typeof HEX_TILE_TYPES,
  landscapeType: keyof typeof LANDSCAPE_TYPES,
  rotationDeg: number,
  isReflected: boolean,
  coords: AxialCoords
}
