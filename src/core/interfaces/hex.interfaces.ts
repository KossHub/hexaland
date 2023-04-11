import {LANDSCAPE_TYPES} from '../classes/LandscapeTemplates/constants'

export type CanvasTemplateScheme<T extends string> = Record<
  T,
  HTMLCanvasElement
>

export type MapDrawnType = 'detailed' | 'simplified'

export type HexDrawnTypes = Record<MapDrawnType, null | string>

export type CanvasTemplatesScheme<T extends string> = Record<
  keyof HexDrawnTypes,
  CanvasTemplateScheme<T>
>

export type TemplateTypes = Record<string, HexDrawnTypes>

export type CanvasLandscapeTemplateScheme = Record<
  keyof typeof LANDSCAPE_TYPES,
  {
    [key: number]: HTMLCanvasElement // key as rotationDeg
  }
>

export type CanvasLandscapeTemplatesScheme = Record<
  keyof HexDrawnTypes,
  CanvasLandscapeTemplateScheme
>
