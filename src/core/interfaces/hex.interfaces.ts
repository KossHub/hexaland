import {PartialRecord} from '../../interfaces'
import {LANDSCAPE} from '../classes/GameMap/constants'

export type LandscapeTemplates = PartialRecord<keyof typeof LANDSCAPE, HTMLCanvasElement>

export interface HexTileTemplates {
  default: null | HTMLCanvasElement
  hovered: null | HTMLCanvasElement
  selected: null | HTMLCanvasElement
}
