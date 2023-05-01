import {random} from 'lodash'

import {
  MapEdges,
  RectMapScheme,
  RectMapSchemeRow
} from '../interfaces/map.interfaces'
import {LANDSCAPES, ROTATION_DEG} from '../classes/LandscapeTemplates/constants'

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

const getRandomGrass = () => Object.keys(LANDSCAPES)[random(3)]

export const getRandomReflectedState = () => Boolean(random(1))

export const getRandomRotation = () =>
  ROTATION_DEG[random(ROTATION_DEG.length - 1)]

export const getDefaultMapScheme = (edges: MapEdges) => {
  const {top, right, bottom, left} = edges
  const coordsScheme: RectMapScheme = {}

  for (let r = top; r <= bottom; r++) {
    const row: RectMapSchemeRow = {}

    const r_offset = r >> 1 // Math.floor(r / 2)
    for (let q = left - r_offset; q <= right - r_offset; q++) {
      row[q] = {
        landscapeType: getRandomGrass(),
        rotationDeg: getRandomRotation(),
        isReflected: getRandomReflectedState()
      }
    }

    coordsScheme[r] = row
  }

  return coordsScheme
}
