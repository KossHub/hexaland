import {HexTileTypes} from '../../interfaces/hex.interfaces'

export const HEX_TILE_TYPE = {
  DEFAULT: 'default',
  HIGHLIGHTED: 'highlighted',
  SELECTED: 'selected'
}

export const HEX_TILE_TYPES: HexTileTypes = {
  [HEX_TILE_TYPE.DEFAULT]: {
    detailedLineColor: '#c5c5c5',
    detailedLineWidth: 1
  },
  [HEX_TILE_TYPE.HIGHLIGHTED]: {
    detailedLineColor: '#fff',
    detailedLineWidth: 2
  },
  [HEX_TILE_TYPE.SELECTED]: {
    detailedLineColor: '#fff7e6',
    detailedLineWidth: 3,
    simplifiedFillColor: 'rgba(255, 247, 230, .65)'
  }
}
