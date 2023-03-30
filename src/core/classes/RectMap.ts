import {
  RectMapCubeCoords,
  RectMapEdgesCubeCoords
} from '../interfaces/map.interfaces'
import {GameMap} from './GameMap'
import {HEX_TILE_RADIUS} from '../../constants'
import {getHexTileWidth} from '../utils/canvasCalculates.utils'

export class RectMap extends GameMap {
  constructor(
    private _edges: RectMapEdgesCubeCoords,
    protected _hexRadius = HEX_TILE_RADIUS
  ) {
    super(_hexRadius)

    this.fillTuple()
  }

  public get tuple() {
    return this._mapTuple
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

  fillTuple() {
    const {top, right, bottom, left} = this._edges
    const cubeCoordsTuple: RectMapCubeCoords[] = []

    for (let r = top; r <= bottom; r++) {
      const r_offset = Math.floor(r / 2.0) // or r>>1
      for (let q = left - r_offset; q <= right - r_offset; q++) {
        cubeCoordsTuple.push([q, r])
      }
    }

    this._mapTuple = cubeCoordsTuple
  }
}
