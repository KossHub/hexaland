import {
  RectMapScheme,
  RectMapSchemeRow
} from '../core/interfaces/map.interfaces'
import {TodoAny} from '../interfaces'
import {LANDSCAPE_TYPES} from '../core/classes/LandscapeTemplates/constants'

export const simplifyMap = (gameMap: RectMapScheme) =>
  Object.keys(gameMap).reduce((acc, r) => {
    const row = gameMap[Number(r)]
    const rowData: TodoAny = {}

    Object.keys(row).forEach((q) => {
      const {landscapeType, rotationDeg, isReflected} = row[Number(q)]
      const idx = Object.keys(LANDSCAPE_TYPES).findIndex(
        (type) => type === landscapeType
      )

      rowData[q] = `${idx} ${isReflected ? '-' : ''}${rotationDeg / 60}`
    })

    acc[r] = rowData

    return acc
  }, {} as TodoAny)

export const parseMap = (gameMap: TodoAny) =>
  Object.keys(gameMap).reduce((acc, r) => {
    const row = gameMap[Number(r)]
    const rowData: RectMapSchemeRow = {}

    Object.keys(row).forEach((q) => {
      const [idx, deg] = row[q].split(' ')

      const landscapeType = Object.keys(LANDSCAPE_TYPES)[idx]
      const rotationDeg = Math.abs(deg) * 60
      const isReflected = deg[0] === '-'

      rowData[Number(q)] = {
        landscapeType,
        rotationDeg,
        isReflected
      }
    })

    acc[Number(r)] = rowData

    return acc
  }, {} as RectMapScheme)
