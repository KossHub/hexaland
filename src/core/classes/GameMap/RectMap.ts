import {
  RectMapEdgesCubeCoords,
  RectMapScheme
} from '../../interfaces/map.interfaces'
import {GameMap} from './GameMap'
import {getHexTileWidth} from '../../utils/canvasCalculates.utils'
import {HEX_TILE_RADIUS} from '../../../constants'
import {ShortCubeCoords} from '../../../contexts/canvas/interfaces'
import {inRange} from 'lodash'

export class RectMap extends GameMap {
  constructor(
    private _edges: RectMapEdgesCubeCoords,
    protected _initializedCb = () => {},
    protected _hexRadius = HEX_TILE_RADIUS
  ) {
    super(_hexRadius)

    this.fillTuple()
    this._initializedCb()
  }

  public get mapScheme() {
    return this._mapScheme
  }

  public get widthInTiles() {
    const {left, right} = this._edges
    return right - left + 1
  }

  public get heightInTiles() {
    const {top, bottom} = this._edges
    return bottom - top + 1
  }

  public get widthInPixels() {
    const hexTileWidth = getHexTileWidth(this._hexRadius)
    return this.widthInTiles * hexTileWidth + hexTileWidth / 2
  }

  public get heightInPixels() {
    return (
      ((this.heightInTiles * 3) / 2) * this._hexRadius + this._hexRadius / 2
    )
  }

  public doesHexExist(coords: ShortCubeCoords) {
    const row = this._mapScheme[coords.r]

    if (!row) {
      return false
    }

    return inRange(coords.q, row[0], row[row.length - 1])
  }

  private fillTuple() {
    const {top, right, bottom, left} = this._edges
    const coordsScheme: RectMapScheme = {}

    for (let r = top; r <= bottom; r++) {
      const row = []

      const r_offset = r >> 1 // Math.floor(r / 2.0)
      for (let q = left - r_offset; q <= right - r_offset; q++) {
        row.push(q)
      }

      coordsScheme[r] = row
    }

    this._mapScheme = coordsScheme
  }
}
