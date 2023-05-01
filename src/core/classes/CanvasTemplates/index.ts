import {
  LandscapeTemplatesScheme,
  HexTilesTemplatesScheme
} from '../../interfaces/hex.interfaces'

// TODO: Implement (?)
export class CanvasTemplates {
  private _hexTileTemplatesScheme: null | HexTilesTemplatesScheme = null
  private _landscapeTemplatesScheme: null | LandscapeTemplatesScheme = null

  constructor(radius: number) {}

  /** Private methods */

  /** Public getters */

  public get grid() {
    return this._hexTileTemplatesScheme
  }

  public get landscape() {
    return this._landscapeTemplatesScheme
  }
}
