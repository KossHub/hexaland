import {
  CanvasLandscapeTemplatesScheme,
  CanvasTemplatesScheme
} from '../../interfaces/hex.interfaces'
import {HEX_TILE_TYPES} from '../HexTileTemplates/constants'
import {HexTileTemplates} from '../HexTileTemplates'
import {LandscapeTemplates} from '../LandscapeTemplates'

// TODO: Implement
export class CanvasTemplates {
  private _hexTileTemplatesScheme: null | CanvasTemplatesScheme<
    keyof typeof HEX_TILE_TYPES
  > = null
  private _landscapeTemplatesScheme: null | CanvasLandscapeTemplatesScheme =
    null

  constructor(radius: number) {
  }

  /** Private methods */


  /** Public getters */

  public get grid() {
    return this._hexTileTemplatesScheme
  }

  public get landscape() {
    return this._landscapeTemplatesScheme
  }
}
