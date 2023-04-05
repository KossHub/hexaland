import {v4} from 'uuid'

import {RectMapInitData} from '../../interfaces/map.interfaces'
import {RectMap} from '../GameMap/RectMap'
import {ShortCubeCoords} from '../../../contexts/canvas/interfaces'

// TODO: implement classes and interfaces
class Player {}
interface GameMetaData {
  gameStart: number
}
/** ==================================== */

export class Game {
  readonly id: null | string = null
  private _map: null | RectMap = null
  private _metaData: null | GameMetaData = null
  private _selectedHex: null | ShortCubeCoords = null
  private _hoveredHex: null | ShortCubeCoords = null

  constructor(
    private _name: string,
    mapInitData: RectMapInitData,
    private _players: Player[],
    initializedCb?: (uuid: string) => void
  ) {
    this.initGame()
    this.initMap(mapInitData)

    const uuid = v4()
    this.id = uuid

    if (initializedCb) {
      initializedCb(uuid)
    }
  }

  private initGame() {
    this._metaData = {
      gameStart: Date.now()
    }
  }

  private initMap(initData: RectMapInitData) {
    this._map = new RectMap(initData)
  }

  public draw() {
    // TODO: implement
    /**
     * 1 - getVisibleTiles from currentUser
     * 2 - map.draw(visibleTiles)
     * */
  }

  public get name() {
    return this._name
  }

  public get gameMap() {
    return this._map
  }

  public get metaData() {
    return this._metaData
  }

  public get players() {
    return this._players
  }

  public get selectedHex() {
    return this._selectedHex
  }

  public set selectedHex(coords: null | ShortCubeCoords) {
    // TODO: put here if exist implementation
    this._selectedHex = coords
  }

  public get hoveredHex() {
    return this._hoveredHex
  }

  public set hoveredHex(coords: null | ShortCubeCoords) {
    // TODO: put here if exist implementation
    this._hoveredHex = coords
  }
}
