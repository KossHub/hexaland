import {RectMapScheme} from '../../interfaces/map.interfaces'
import {
  AxialCoords,
  CanvasContextState,
  ShortCubeCoords
} from '../../../contexts/canvas/interfaces'
import {Hex} from '../Hex/Hex'
import {TILE_BORDER_COLOR} from '../../../constants'
import {
  GameMapContextState
} from '../../../contexts/gameMap/interfaces'
import {HexTileTemplates} from '../../interfaces/hex.interfaces'
import {CUBE_DIRECTION_VECTORS, TILE_COLOR_TYPES, Vector} from './constants'
import {isEqual} from 'lodash'
import {getHexTileHeight} from '../../utils/canvasCalculates.utils'

export class GameMap {
  private _hexTileTemplate: HexTileTemplates = {
    default: null,
    hovered: null,
    selected: null
  }

  protected _mapScheme: RectMapScheme = {}

  constructor(protected _hexRadius: number) {
    this.fillHexTileTemplates()
  }

  protected doesHexExist(coords: ShortCubeCoords): boolean {
    throw new Error('Method not implemented.')
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
    coords: AxialCoords,
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
      coords.x - this._hexRadius,
      coords.y - this._hexRadius
    )

    ctx.restore()
  }

  /** cube_add & cube_scale */
  protected getShiftedHexTile(
    origin: ShortCubeCoords,
    vector: Vector,
    distance = 1
  ): ShortCubeCoords {
    if (distance < 1) {
      throw new Error(
        `getShiftedHexTile distance cannot be less than 1. Passed ${distance}`
      )
    }

    return {
      q: origin.q + vector.q * distance,
      r: origin.r + vector.r * distance
    }
  }

  /** cube_ring */
  protected getRingHexTiles(
    center: ShortCubeCoords,
    radius: number
  ): ShortCubeCoords[] {
    /**
     *  steps away from the center,
     *  then follow the rotated vectors in a path around the ring
     * */
    if (radius === 0) {
      return []
    }

    const result: ShortCubeCoords[] = []

    let anchorHex = this.getShiftedHexTile(
      center,
      CUBE_DIRECTION_VECTORS.BOTTOM_LEFT,
      radius
    )

    Object.values(CUBE_DIRECTION_VECTORS).forEach((vector) => {
      for (let i = 0; i < radius; i++) {
        result.push(anchorHex)
        anchorHex = this.getShiftedHexTile(anchorHex, vector)
      }
    })

    return result
  }

  /** cube_spiral */
  protected getSpiralHexTiles(
    center: ShortCubeCoords,
    maxRadius: number
  ): ShortCubeCoords[] {
    const result = [center]

    for (let radius = 1; radius <= maxRadius; radius++) {
      result.push(...this.getRingHexTiles(center, radius))
    }

    return result
  }

  public drawHexTiles(
    canvas: CanvasContextState,
    centerHexCoords: ShortCubeCoords,
    hoveredHex?: GameMapContextState['hoveredHex'],
    selectedHex?: GameMapContextState['selectedHex']
  ) {
    if (!canvas || !canvas.ref) {
      return
    }

    const canvasWidth = canvas.ref.width
    const canvasHeight = canvas.ref.height
    const canvasDiagonal = Math.ceil(
      Math.sqrt(Math.pow(canvasWidth, 2) + Math.pow(canvasHeight, 2))
    )
    const spiralRadiusInTiles =
      Math.ceil(
        ((canvasDiagonal / getHexTileHeight(this._hexRadius * canvas.scale)) *
          4) /
          3 /
          2
      ) + 1
    /**
     * move in a spiral from the center hex tile
     * and collect them until the entire circle is offscreen
     * */
    const visibleTiles: ShortCubeCoords[] = this.getSpiralHexTiles(
      centerHexCoords,
      spiralRadiusInTiles
    )

    const tilesToDraw = visibleTiles
      .filter((coords) => this.doesHexExist(coords))
      .map((coords) => {
        const hexTile = new Hex(coords.q, coords.r)

        return {
          coords: hexTile.getAxialShiftedCoords(this._hexRadius, canvas.scale),
          isHighlighted: isEqual(coords, hoveredHex),
          isSelected: isEqual(coords, selectedHex)
        }
      })

    tilesToDraw.forEach(({coords, isHighlighted, isSelected}) => {
      this.drawHexTile(canvas.ctx, coords, isHighlighted, isSelected)
    })
  }

  public getHexCoords(pixelCoords: AxialCoords): ShortCubeCoords {
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
