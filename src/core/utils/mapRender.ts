import {PreparedForRenderHex} from '../interfaces/map.interfaces'
import {HEX_TILE_TYPE} from '../classes/HexTileTemplates/constants'

export const sortingBeforeRendering = (
  a: Pick<PreparedForRenderHex, 'hexType'>,
  b: Pick<PreparedForRenderHex, 'hexType'>
) => {
  switch (true) {
    case a.hexType === HEX_TILE_TYPE.SELECTED &&
      b.hexType !== HEX_TILE_TYPE.SELECTED: {
      return 1
    }
    case a.hexType !== HEX_TILE_TYPE.SELECTED &&
      b.hexType === HEX_TILE_TYPE.SELECTED: {
      return -1
    }
    case a.hexType === HEX_TILE_TYPE.HIGHLIGHTED &&
      b.hexType !== HEX_TILE_TYPE.HIGHLIGHTED: {
      return 1
    }
    case a.hexType !== HEX_TILE_TYPE.HIGHLIGHTED &&
      b.hexType === HEX_TILE_TYPE.HIGHLIGHTED: {
      return -1
    }
    default: {
      return 0
    }
  }
}
