import {RectMap} from '../../core/classes/GameMap/RectMap'
import {ShortCubeCoords} from '../canvas/interfaces'

export interface GameMapContextState {
  gameMap: null | RectMap
  hoveredHex: null | ShortCubeCoords
  selectedHex: null | ShortCubeCoords
}

export interface HexTileTemplates {
  default: null | HTMLCanvasElement
  hovered: null | HTMLCanvasElement
  selected: null | HTMLCanvasElement
}
 // TODO: Add NotNullable allContextStates
