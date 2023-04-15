import {isEqual} from 'lodash'

import {RectMapScheme} from '../../interfaces/map.interfaces'
import {
  AxialCoords,
  CanvasContextState,
  ShortCubeCoords
} from '../../../contexts/canvas/interfaces'
import {Hex} from '../Hex'
import {
  CanvasLandscapeTemplatesScheme,
  CanvasTemplatesScheme,
  MapMode
} from '../../interfaces/hex.interfaces'
import {HexTileTemplates} from '../HexTileTemplates'
import {LandscapeTemplates} from '../LandscapeTemplates'
import {CUBE_DIRECTION_VECTORS, Vector} from './constants'
import {HEX_TILE_TYPES} from '../HexTileTemplates/constants'
import {SCALE} from '../../../constants'
import {getHexTileHeight} from '../../utils/canvasCalculates.utils'

// TODO: Use only RectMap without inheritance from GameMap
export class GameMap {
  protected _hexTileTemplatesScheme: null | CanvasTemplatesScheme<
    keyof typeof HEX_TILE_TYPES
  > = null
  protected _landscapeTemplatesScheme: null | CanvasLandscapeTemplatesScheme =
    null

  // TODO: make public
  protected _mapScheme: RectMapScheme = {}
  // private _selectedHex: null | ShortCubeCoords = null
  // private _hoveredHex: null | ShortCubeCoords = null

  constructor(protected _hexRadius: number) {
    const hexTileTemplates = new HexTileTemplates(_hexRadius)
    this._hexTileTemplatesScheme = hexTileTemplates.scheme

    const landscapeTemplates = new LandscapeTemplates(_hexRadius)
    this._landscapeTemplatesScheme = landscapeTemplates.scheme
  }

  /** Public methods */

  public doesHexExist(coords: ShortCubeCoords): boolean {
    throw new Error('Method not implemented.')
  }

  // cube_ring
  public getRingHexTiles(
      center: ShortCubeCoords,
      radius: number
  ): ShortCubeCoords[] {
    //steps away from the center, then follow the rotated vectors in a path around the ring
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

  // cube_spiral
  public getSpiralHexTiles(
      center: ShortCubeCoords,
      maxRadius: number
  ): ShortCubeCoords[] {
    const result = [center]

    for (let radius = 1; radius <= maxRadius; radius++) {
      result.push(...this.getRingHexTiles(center, radius))
    }

    return result
  }

  /** Private methods */

  private drawLandscape(
    ctx: null | CanvasRenderingContext2D,
    coords: AxialCoords,
    landscapeType: string,
    mapType: MapMode = 'detailed',
    rotationDeg: number = 0,
    isReflected: boolean = false
  ) {
    if (!ctx) {
      return
    }

    const canvasTemplate =
      this._landscapeTemplatesScheme?.[mapType]?.[landscapeType][
        mapType === 'detailed' ? rotationDeg : 0
      ]

    if (!canvasTemplate) {
      return
    }

    ctx.save()

    if (isReflected) {
      ctx.scale(-1, 1)
      ctx.drawImage(
        canvasTemplate,
        (coords.x + this._hexRadius) * -1,
        coords.y - this._hexRadius
      )
      ctx.scale(-1, 1)
    } else {
      ctx.drawImage(
        canvasTemplate,
        coords.x - this._hexRadius,
        coords.y - this._hexRadius
      )
    }

    ctx.restore()
  }

  private drawHexTile(
    ctx: null | CanvasRenderingContext2D,
    coords: AxialCoords,
    mapType: MapMode = 'detailed',
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

  // cube_add & cube_scale
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

        const {landscapeType, rotationDeg, isReflected} =
          this._mapScheme[coords.r][coords.q]

        return {
          hexType,
          coords: hexTile.getAxialShiftedCoords(this._hexRadius, canvas.scale),
          landscapeType,
          rotationDeg,
          isReflected
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
      .forEach(({coords, hexType, landscapeType, rotationDeg, isReflected}) => {
        const mapType =
          canvas.scale < SCALE.SIMPLIFIED_MAP ? 'simplified' : 'detailed'

        this.drawHexTile(canvas.contexts.grid, coords, mapType, hexType)
        this.drawLandscape(
          canvas.contexts.landscape,
          coords,
          landscapeType,
          mapType,
          rotationDeg,
          isReflected
        )
      })
  }




  /** Public getters */

  // TODO: remove from class
  public get hexRadius() {
    return this._hexRadius
  }

  // public get selectedHex() {
  //   return this._selectedHex
  // }
  //
  // public set selectedHex(coords: null | ShortCubeCoords) {
  //   // TODO: put here implementation, if exists
  //   this._selectedHex = coords
  // }
  //
  // public get hoveredHex() {
  //   return this._hoveredHex
  // }
  //
  // public set hoveredHex(coords: null | ShortCubeCoords) {
  //   // TODO: put here implementation, if exists
  //   this._hoveredHex = coords
  // }
}
