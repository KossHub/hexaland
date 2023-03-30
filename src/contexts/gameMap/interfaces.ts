import {RectMap} from '../../core/classes/RectMap'
import {ShortCubeCoordinates} from '../canvas/interfaces'

export interface GameMapContextState {
  gameMap: null | RectMap
  hoveredHex: null | ShortCubeCoordinates
}
