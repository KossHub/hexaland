import {HexTileTemplates} from '../../../contexts/gameMap/interfaces'

export const TILE_COLOR_TYPES: Record<keyof HexTileTemplates, string> = {
  default: '',
  hovered: '#eee',
  selected: '#204030'
}
