export type CanvasTemplateScheme<T extends string> = Record<T, HTMLCanvasElement>

export type MapDrawnType = 'detailed' | 'simplified'

export type HexDrawnTypes = Record<MapDrawnType, null | string>

export type CanvasTemplatesScheme<T extends string> = Record<
  keyof HexDrawnTypes,
  CanvasTemplateScheme<T>
>

export type TemplateTypes = Record<string, HexDrawnTypes>
