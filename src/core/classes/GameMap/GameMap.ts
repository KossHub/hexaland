import {RectMapCubeCoords} from '../../interfaces/map.interfaces'
import {
  AxialCoordinates,
  CanvasContextState,
  ShortCubeCoordinates
} from '../../../contexts/canvas/interfaces'
import {Hex} from '../Hex/Hex'
import {
  GAME_MAP_BORDER_SIZE,
  HEX_TILE_RADIUS,
  TILE_BORDER_COLOR
} from '../../../constants'
import {
  GameMapContextState,
  HexTileTemplates
} from '../../../contexts/gameMap/interfaces'
import {TILE_COLOR_TYPES} from './constants'

export class GameMap {
  private _hexTileTemplate: HexTileTemplates = {
    default: null,
    hovered: null,
    selected: null
  }

  protected _mapTuple: RectMapCubeCoords[] = []

  constructor(protected _hexRadius = HEX_TILE_RADIUS) {
    this.fillHexTileTemplates()
  }

  private fillHexTileTemplates() {
    Object.keys(TILE_COLOR_TYPES).forEach((key) => {
      const offscreenCanvas = document.createElement('canvas')
      const size = this._hexRadius * 2
      offscreenCanvas.width = size
      offscreenCanvas.height = size
      const offscreenCtx = offscreenCanvas.getContext(
        '2d'
      ) as CanvasRenderingContext2D

      /** draw hex tile templates */
      offscreenCtx.beginPath()

      for (let i = 0; i < 6; i++) {
        const angleDeg = 60 * i - 30
        const angleRad = (Math.PI / 180) * angleDeg
        offscreenCtx.lineTo(
          this._hexRadius * Math.cos(angleRad) + this._hexRadius,
          this._hexRadius * Math.sin(angleRad) + this._hexRadius
        )
      }

      offscreenCtx.closePath()
      offscreenCtx.strokeStyle = TILE_BORDER_COLOR
      offscreenCtx.lineWidth = 1
      offscreenCtx.stroke()

      const color = TILE_COLOR_TYPES[key as keyof HexTileTemplates]

      if (color) {
        offscreenCtx.fillStyle = color
        offscreenCtx.fill()
      }

      this._hexTileTemplate[key as keyof HexTileTemplates] = offscreenCanvas
    })
  }

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

    ctx.save()

    let offscreenCanvasTemplate = this._hexTileTemplate
      .default as HTMLCanvasElement

    if (isSelected) {
      offscreenCanvasTemplate = this._hexTileTemplate
        .selected as HTMLCanvasElement
    } else if (isHighlighted) {
      offscreenCanvasTemplate = this._hexTileTemplate
        .hovered as HTMLCanvasElement
    }

    ctx.drawImage(
      offscreenCanvasTemplate,
      coordinates.x - this._hexRadius,
      coordinates.y - this._hexRadius
    )

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
