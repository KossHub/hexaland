import {RectMapCubeCoords} from '../interfaces/map.interfaces'
import {
  AxialCoordinates,
  CanvasContextState,
  ShortCubeCoordinates
} from '../../contexts/canvas/interfaces'
import {Hex} from './Hex'
import {
  GAME_MAP_BORDER_SIZE,
  HEX_TILE_RADIUS,
  TILE_BORDER_COLOR
} from '../../constants'
import {GameMapContextState} from '../../contexts/gameMap/interfaces'

export class GameMap {
  protected _mapTuple: RectMapCubeCoords[] = []

  constructor(protected _hexRadius = HEX_TILE_RADIUS) {}

  public get hexRadius() {
    return this._hexRadius
  }

  private drawHexTile(
    ctx: CanvasContextState['ctx'],
    coordinates: AxialCoordinates,
    isHighlighted?: boolean,
    isSelected?: boolean
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

    if (isHighlighted) {
      ctx.fillStyle = '#fff'
      ctx.fill()
    }

    if (isSelected) {
      ctx.fillStyle = '#aaa'
      ctx.fill()
    }

    ctx.restore()
  }

  public doesHexExist(coords: ShortCubeCoordinates) {
    return this._mapTuple.some(([q, r]) => q === coords.q && r === coords.r)
  }

  public drawHexTiles(
    ctx: CanvasContextState['ctx'],
    scale = 1,
    hoveredHex?: GameMapContextState['hoveredHex'],
    selectedHex?: GameMapContextState['selectedHex']
  ) {
    if (!ctx) {
      return
    }

    this._mapTuple.forEach(([q, r]) => {
      const hexTile = new Hex(q, r)
      const isSelected = q === selectedHex?.q && r === selectedHex?.r
      const isHighlighted =
        !isSelected && q === hoveredHex?.q && r === hoveredHex?.r
      const originCoords = hexTile.getAxialCoordinates(this._hexRadius)
      const shiftedCoords = {
        x:
          originCoords.x + // origin
          (Math.sqrt(3) * this._hexRadius) / 2 + // projecting hex part
          GAME_MAP_BORDER_SIZE / scale, // border
        y:
          originCoords.y + // origin
          this._hexRadius + // projecting hex part
          GAME_MAP_BORDER_SIZE / scale // border
      }

      this.drawHexTile(ctx, shiftedCoords, isHighlighted, isSelected)
    })
  }

  public getHexCoords(pixelCoords: AxialCoordinates): ShortCubeCoordinates {
    const {x, y} = pixelCoords
    const fractionalQ = ((Math.sqrt(3) / 3) * x - (1 / 3) * y) / this._hexRadius
    const fractionalR = ((2 / 3) * y) / this._hexRadius
    const fractionalS = -fractionalQ - fractionalR
    let q = Math.round(fractionalQ)
    let r = Math.round(fractionalR)
    const s = Math.round(fractionalS)
    const qDiff = Math.abs(q - fractionalQ)
    const rDiff = Math.abs(r - fractionalR)
    const sDiff = Math.abs(s - fractionalS)

    if (qDiff > rDiff && qDiff > sDiff) {
      q = -r - s
    } else if (rDiff > sDiff) {
      r = -q - s
    }

    return {q, r}
  }
}
