import {v4} from 'uuid'

import {RectMap} from '../GameMap/RectMap'

// TODO: implement classes and interfaces
class Player {}
interface GameMetaData {
  gameStart: number
}
/** ==================================== */

export class Game {
  readonly id: null | string = null
  private _metaData: null | GameMetaData = null

  constructor(
    private _name: string,
    // mapInitData: MapEdges,
    private _map: RectMap,
    private _players: Player[],
    initializedCb?: (uuid: string) => void
  ) {
    this.initGame()
    // this.initMap(mapInitData)

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

  // private initMap(initData: MapEdges) {
  //   this._map = new RectMap(initData)
  // }

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
}
