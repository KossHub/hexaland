import {PreparedForRenderHex} from '../interfaces/map.interfaces'

export const sortingBeforeRendering = (
  a: Pick<PreparedForRenderHex, 'hexType'>,
  b: Pick<PreparedForRenderHex, 'hexType'>
) => {
  switch (true) {
    case a.hexType === 'selected' && b.hexType !== 'selected': {
      return 1
    }
    case a.hexType !== 'selected' && b.hexType === 'selected': {
      return -1
    }
    case a.hexType === 'highlighted' && b.hexType !== 'highlighted': {
      return 1
    }
    case a.hexType !== 'highlighted' && b.hexType === 'highlighted': {
      return -1
    }
    default: {
      return 0
    }
  }
}
