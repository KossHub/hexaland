import {inRange} from 'lodash'

import {MapEdges, RectMapScheme} from '../../interfaces/map.interfaces'
import {GameMap} from './index'
import {getHexTileWidth} from '../../utils/canvasCalculates.utils'
import {HEX_TILE_RADIUS} from '../../../constants'
import {ShortCubeCoords} from '../../../contexts/canvas/interfaces'
import {getMapEdges} from '../../utils/mapCalculated'

export class RectMap extends GameMap {
  private _edges: null | MapEdges = null

  constructor(
    protected _mapScheme: RectMapScheme,
    protected _hexRadius = HEX_TILE_RADIUS,
    protected _initializedCb = () => {}
  ) {
    super(_hexRadius)
    this.fillMapEdges()
    this._initializedCb()
  }

  public get mapScheme() {
    return this._mapScheme
  }

  public get widthInTiles() {
    const {left, right} = this._edges!
    return right - left + 1
  }

  public get heightInTiles() {
    const {top, bottom} = this._edges!
    return bottom - top + 1
  }

  // TODO : Rm to 2dView
  public get widthInPixels() {
    const hexTileWidth = getHexTileWidth(this._hexRadius)
    return this.widthInTiles * hexTileWidth + hexTileWidth / 2
  }
// TODO : Rm to 2dView
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

    const arrOfQ = Object.keys(row).map((q) => Number(q))

    return inRange(coords.q, Math.min(...arrOfQ), Math.max(...arrOfQ) + 1)
  }

  public set mapScheme(scheme: RectMapScheme) {
    this._mapScheme = scheme
    this.fillMapEdges()
  }

  private fillMapEdges() {
    this._edges = getMapEdges(this._mapScheme)
  }
}
