import {isEqual} from 'lodash'

import {RectMapScheme} from '../../interfaces/map.interfaces'
import {
  AxialCoords,
  CanvasContextState,
  ShortCubeCoords
} from '../../../contexts/canvas/interfaces'
import {Hex} from '../Hex/Hex'
import {
  CanvasTemplatesScheme,
  MapDrawnType
} from '../../interfaces/hex.interfaces'
import {CUBE_DIRECTION_VECTORS, Vector} from './constants'
import {getHexTileHeight} from '../../utils/canvasCalculates.utils'
import {HexTileTemplates} from '../HexTileTemplates/TileTemplates'
import {HEX_TILE_TYPES} from '../HexTileTemplates/constants'
import {LANDSCAPE_TYPES} from '../LandscapeTemplates/constants'
import {LandscapeTemplates} from '../LandscapeTemplates/LandscapeTemplates'
import {SCALE} from "../../../constants";

export class GameMap {
  protected _hexTileTemplatesScheme: null | CanvasTemplatesScheme<
    keyof typeof HEX_TILE_TYPES
  > = null
  protected _landscapeTemplatesScheme: null | CanvasTemplatesScheme<
    keyof typeof LANDSCAPE_TYPES
  > = null
  protected _mapScheme: RectMapScheme = {}
  private _selectedHex: null | ShortCubeCoords = null
  private _hoveredHex: null | ShortCubeCoords = null

  constructor(protected _hexRadius: number) {
    const hexTileTemplates = new HexTileTemplates(_hexRadius)
    this._hexTileTemplatesScheme = hexTileTemplates.scheme

    const landscapeTemplates = new LandscapeTemplates(_hexRadius)
    this._landscapeTemplatesScheme = landscapeTemplates.scheme
  }

  public doesHexExist(coords: ShortCubeCoords): boolean {
    throw new Error('Method not implemented.')
  }

  public get hexRadius() {
    return this._hexRadius
  }

  private drawLandscape(
    ctx: null | CanvasRenderingContext2D,
    coords: AxialCoords,
    mapType: MapDrawnType = 'detailed'
  ) {
    if (!ctx) {
      return
    }

    const canvasTemplate = this._landscapeTemplatesScheme?.[mapType]?.['GRASS_1']

    if (!canvasTemplate) {
      return
    }

    ctx.save()
    ctx.drawImage(
      canvasTemplate,
      coords.x - this._hexRadius,
      coords.y - this._hexRadius
    )
    ctx.restore()
  }

  private drawHexTile(
    ctx: null | CanvasRenderingContext2D,
    coords: AxialCoords,
    mapType: MapDrawnType = 'detailed',
    hexType: keyof typeof HEX_TILE_TYPES = 'default'
  ) {
    if (!ctx) {
      return
    }

    const canvasTemplate = this._hexTileTemplatesScheme?.[mapType]?.[hexType]

    if (!canvasTemplate) {
      return
    }

    ctx.save()
    ctx.drawImage(
      canvasTemplate,
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

  public get widthInPixels(): number {
    throw new Error('widthInPixels is not implemented')
  }

  public get heightInPixels(): number {
    throw new Error('heightInPixels is not implemented')
  }

  public drawHexTiles(
    canvas: CanvasContextState,
    centerHexCoords: ShortCubeCoords,
    hoveredHex?: null | ShortCubeCoords,
    selectedHex?: null | ShortCubeCoords
  ) {
    if (!canvas || !canvas.wrapperRef) {
      return
    }

    const canvasWidth = canvas.wrapperRef.clientWidth
    const canvasHeight = canvas.wrapperRef.clientHeight
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

    visibleTiles
      .filter((coords) => this.doesHexExist(coords))
      .map((coords) => {
        const hexTile = new Hex(coords.q, coords.r)
        const isHighlighted = isEqual(coords, hoveredHex)
        const isSelected = isEqual(coords, selectedHex)

        let hexType: keyof typeof HEX_TILE_TYPES = 'default'
        if (isSelected) {
          hexType = 'selected'
        } else if (isHighlighted) {
          hexType = 'highlighted'
        }

        return {
          hexType,
          coords: hexTile.getAxialShiftedCoords(this._hexRadius, canvas.scale)
        }
      })
      .sort((a, b) => {
        if (a.hexType === 'selected' && b.hexType !== 'selected') {
          return 1
        }
        if (a.hexType !== 'selected' && b.hexType === 'selected') {
          return -1
        }
        if (a.hexType === 'highlighted' && b.hexType !== 'highlighted') {
          return 1
        }
        if (a.hexType !== 'highlighted' && b.hexType === 'highlighted') {
          return -1
        }
        return 0
      })
      .forEach(({coords, hexType}) => {
        const mapType = canvas.scale < SCALE.SIMPLIFIED_MAP ? 'simplified' : 'detailed'

        this.drawHexTile(canvas.contexts.grid, coords, mapType, hexType)
        this.drawLandscape(canvas.contexts.landscape, coords, mapType)
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

  public get selectedHex() {
    return this._selectedHex
  }

  public set selectedHex(coords: null | ShortCubeCoords) {
    // TODO: put here implementation, if exists
    this._selectedHex = coords
  }

  public get hoveredHex() {
    return this._hoveredHex
  }

  public set hoveredHex(coords: null | ShortCubeCoords) {
    // TODO: put here implementation, if exists
    this._hoveredHex = coords
  }
}
