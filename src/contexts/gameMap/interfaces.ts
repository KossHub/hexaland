import {RectMap} from '../../core/classes/GameMap/RectMap'
import {ShortCubeCoordinates} from '../canvas/interfaces'

export interface GameMapContextState {
  gameMap: null | RectMap
  hoveredHex: null | ShortCubeCoordinates
  selectedHex: null | ShortCubeCoordinates
}

export interface HexTileTemplates {
  default: null | HTMLCanvasElement
  hovered: null | HTMLCanvasElement
  selected: null | HTMLCanvasElement
}
