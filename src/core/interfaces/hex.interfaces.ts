import {LANDSCAPES} from '../classes/LandscapeTemplates/constants'
import {HEX_TILE_TYPES} from '../classes/HexTileTemplates/constants'

// export type CanvasTemplateScheme<T extends string> = Record<
//   T,
//   HTMLCanvasElement
// >

// export type MapMode = 'detailed' | 'simplified'

// export type HexDrawnTypes = Record<MapMode, null | string>
//
// export type CanvasTemplatesScheme<T extends string> = Record<
//   keyof HexDrawnTypes,
//   CanvasTemplateScheme<T>
// >
//
// export type TemplateTypes = Record<string, HexDrawnTypes>

// export type CanvasLandscapeTemplateScheme = Record<
//   keyof typeof LANDSCAPE_TYPES,
//   {
//     [key: number]: HTMLCanvasElement // key as rotationDeg
//   }
// >

// export type LandscapeTemplatesScheme = Record<
//   keyof HexDrawnTypes,
//   CanvasLandscapeTemplateScheme
// >

// ============= NEW ====================

export interface LandscapeType {
  name: string
  imageName: string
  color: string
  travelSpeed: number | number[] // 6 values corresponding to CUBE_DIRECTION_VECTORS
  isViewObstacle: boolean
  description: string
}

export type Landscapes = Record<string, LandscapeType>

export type LandscapeFactory = {
  [key: string]: (imageName: string) => LandscapeType
}

type TemplateImageVariant = number
type RotationDeg = number

export interface LandscapeTemplatesScheme {
  detailed: {
    [key: keyof typeof LANDSCAPES]: {
      [key: RotationDeg]: HTMLCanvasElement
    }
  }
  simplified: {
    [key: keyof typeof LANDSCAPES]: HTMLCanvasElement
  }
}

export interface HexTileTypes {
  [key: string]: {
    detailedLineColor: string
    detailedLineWidth: number
    simplifiedFillColor?: string
  }
}

interface HexTilesTemplateScheme {
  [key: keyof typeof HEX_TILE_TYPES]: HTMLCanvasElement
}

export interface HexTilesTemplatesScheme {
  detailed: HexTilesTemplateScheme
  simplified: HexTilesTemplateScheme
}
