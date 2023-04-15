import {MapEdges, RectMapScheme} from '../interfaces/map.interfaces'

export const getMapEdges = (mapScheme: RectMapScheme): MapEdges => {
  const rows = Object.keys(mapScheme)

  return {
    top: 0,
    bottom: rows.length - 1,
    left: 0,
    right: Object.keys(mapScheme[Number(rows[0])]).length - 1
  }
}
