import {ShortCubeCoords} from '../canvas/interfaces'
import {Game} from '../../core/classes/Game/Game'

export interface GameContextState {
  game: null | Game
  hoveredHex: null | ShortCubeCoords
  selectedHex: null | ShortCubeCoords
}
