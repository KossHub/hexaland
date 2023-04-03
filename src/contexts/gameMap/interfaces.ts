import {RectMap} from '../../core/classes/GameMap/RectMap'
import {ShortCubeCoords} from '../canvas/interfaces'

export interface GameMapContextState {
  gameMap: null | RectMap
  hoveredHex: null | ShortCubeCoords
  selectedHex: null | ShortCubeCoords
}
