import {HexTileTemplates} from '../../interfaces/hex.interfaces'
import {ShortCubeCoords} from '../../../contexts/canvas/interfaces'

export const TILE_BORDER_COLOR = '#ddd'

export const TILE_COLOR_TYPES: Record<keyof HexTileTemplates, string> = {
  default: '',
  hovered: '#aaa',
  selected: '#0f403f'
}

export const CUBE_DIRECTION_VECTORS: Record<string, ShortCubeCoords> = {
  RIGHT: {q: 1, r: 0},
  TOP_RIGHT: {q: 1, r: -1},
  TOP_LEFT: {q: 0, r: -1},
  LEFT: {q: -1, r: 0},
  BOTTOM_LEFT: {q: -1, r: 1},
  BOTTOM_RIGHT: {q: 0, r: 1}
}

export type Vector =
  (typeof CUBE_DIRECTION_VECTORS)[keyof typeof CUBE_DIRECTION_VECTORS]
