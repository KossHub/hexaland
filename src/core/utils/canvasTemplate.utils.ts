import {
  RectMapInitData,
  RectMapScheme,
  RectMapSchemeRow
} from '../interfaces/map.interfaces'

export const getCanvasTemplate = (
  radius: number
): {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
} => {
  const canvas = document.createElement('canvas')
  const size = radius * 2
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D

  return {
    canvas,
    ctx
  }
}

export const getDefaultMapScheme = (edges: RectMapInitData) => {
  const {top, right, bottom, left} = edges
  const coordsScheme: RectMapScheme = {}

  for (let r = top; r <= bottom; r++) {
    const row: RectMapSchemeRow = {}

    const r_offset = r >> 1 // Math.floor(r / 2)
    for (let q = left - r_offset; q <= right - r_offset; q++) {
      row[q] = {
        landscapeType: 'GRASS_1',
        rotationDeg: 0,
        isReflected: false
      }
    }

    coordsScheme[r] = row
  }

  return coordsScheme
}
