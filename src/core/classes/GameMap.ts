import {RectMapCubeCoords} from '../interfaces/map.interfaces'
import {
  AxialCoordinates,
  CanvasContextState
} from '../../contexts/canvas/interfaces'
import {Hex} from './Hex'
import {
  GAME_MAP_BORDER_SIZE,
  HEX_TILE_RADIUS,
  TILE_BORDER_COLOR
} from '../../constants'

export class GameMap {
  protected _mapTuple: RectMapCubeCoords[] = []

  constructor(protected _hexRadius = HEX_TILE_RADIUS) {}

  public get hexRadius() {
    return this._hexRadius
  }

  private drawHexTile(
    ctx: CanvasContextState['ctx'],
    coordinates: AxialCoordinates
  ) {
    if (!ctx) {
      return
    }

    const {x, y} = coordinates

    ctx.save()
    ctx.beginPath()

    for (let i = 0; i < 6; i++) {
      const angleDeg = 60 * i - 30
      const angleRad = (Math.PI / 180) * angleDeg
      ctx.lineTo(
        x + this._hexRadius * Math.cos(angleRad),
        y + this._hexRadius * Math.sin(angleRad)
      )
    }

    ctx.closePath()
    ctx.strokeStyle = TILE_BORDER_COLOR
    ctx.lineWidth = 1
    ctx.stroke()
    ctx.restore()
  }

  public drawHexTiles(ctx: CanvasContextState['ctx']) {
    if (!ctx) {
      return
    }

    this._mapTuple.forEach(([q, r]) => {
      const hexTile = new Hex(q, r)
      const originCoords = hexTile.getAxialCoordinates(this._hexRadius)
      const shiftedCoords = {
        x:
          originCoords.x +
          (Math.sqrt(3) * this._hexRadius) / 2 +
          GAME_MAP_BORDER_SIZE,
        y: originCoords.y + this._hexRadius + GAME_MAP_BORDER_SIZE
      }

      this.drawHexTile(ctx, shiftedCoords)
    })
  }
}
