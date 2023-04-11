import {TemplateTypes} from '../../interfaces/hex.interfaces'

export const LANDSCAPE_TYPES: TemplateTypes = {
  GRASS_1: {
    detailed: 'grass1.png',
    simplified: '#42562e'
  },
  GRASS_2: {
    detailed: 'grass2.png',
    simplified: '#42562e'
  }
}

export const ROTATION_DEG = [0, 60, 120, 180, 240, 300] as const
