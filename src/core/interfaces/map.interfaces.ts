export interface MapScheme { // FIXME: rm if useless
  [key: string]: (number | null)[]
}

export interface RectMapScheme extends MapScheme {
  [key: string]: number[] // {r: [q,  q, ...]}
}

export interface RectMapInitData {
  top: number
  right: number
  bottom: number
  left: number
}
