import {MutableRefObject} from 'react'

import {AxialCoords, ShortCubeCoords} from '../../../contexts/canvas/interfaces'
import {
  MapEdges,
  MapEventListener,
  PreparedForRenderHex
} from '../../interfaces/map.interfaces'
import {GameMap} from '../GameMap'
import {Hex} from '../Hex'
import {CanvasTemplates} from '../CanvasTemplates'
import {
  CanvasLandscapeTemplatesScheme,
  CanvasTemplatesScheme,
  MapMode
} from '../../interfaces/hex.interfaces'
import {
  SCALE,
  ZERO_AXIAL_COORDS,
  ZERO_SHORT_CUBE_COORDS
} from '../../../constants'
import {HEX_TILE_TYPES} from '../HexTileTemplates/constants'
import {getHexTileHeight} from '../../utils/canvasCalculates.utils'
import {isEqual} from 'lodash'
import {sortingBeforeRendering} from '../../utils/mapRender'
import {HexTileTemplates} from '../HexTileTemplates'
import {LandscapeTemplates} from '../LandscapeTemplates'
import {RectMap} from "../GameMap/RectMap";

export class Map2DRenderer {
  private _gridCtx: null | CanvasRenderingContext2D = null
  private _landscapeCtx: null | CanvasRenderingContext2D = null
  private _selectedHex: null | ShortCubeCoords = null
  private _hoveredHex: null | ShortCubeCoords = null
  private _centerHex: ShortCubeCoords = ZERO_SHORT_CUBE_COORDS
  private _scale: number = SCALE.INIT
  private _offset: AxialCoords = ZERO_AXIAL_COORDS
  private _subscribers: MapEventListener[] = []
  // private _canvasTemplates: null | CanvasTemplates = null

  protected _hexTileTemplatesScheme: null | CanvasTemplatesScheme<
    keyof typeof HEX_TILE_TYPES
  > = null
  protected _landscapeTemplatesScheme: null | CanvasLandscapeTemplatesScheme =
    null

  constructor(
    private _hexRadius: number,
    private _wrapperRef: MutableRefObject<HTMLDivElement>,
    private _gridCanvasRef: MutableRefObject<HTMLCanvasElement>,
    private _landscapeCanvasRef: MutableRefObject<HTMLCanvasElement>,
    private _mapEdgesInHex: MapEdges
  ) {
    // this._canvasTemplates = new CanvasTemplates(_hexRadius)

    const hexTileTemplates = new HexTileTemplates(_hexRadius)
    this._hexTileTemplatesScheme = hexTileTemplates.scheme

    const landscapeTemplates = new LandscapeTemplates(_hexRadius)
    this._landscapeTemplatesScheme = landscapeTemplates.scheme


  }

  /** Public methods */

  public subscribe(listener: MapEventListener) {
    this._subscribers.push(listener)
  }

  public unsubscribe(listener: MapEventListener) {
    this._subscribers = this._subscribers.filter((subs) => subs !== listener)
  }

  public updateCenterHex() {
    // TODO: implement
    this._subscribers.forEach((subs) => subs?.onChangeCenterHex?.())
  }

  public drawMap(gameMap: RectMap) {
    if (!this._wrapperRef) {
      return
    }

    this.clearMap()

    const canvasDiagonal = Math.ceil(
      Math.sqrt(
        Math.pow(this._canvasWidth, 2) + Math.pow(this._canvasHeight, 2)
      )
    )
    const spiralRadiusInTiles = Math.ceil(
      ((canvasDiagonal / getHexTileHeight(this._hexRadius * this._scale)) * 4) /
        3 /
        2
    )
    // move in a spiral from the center hex tile and collect them until the entire circle is offscreen
    const visibleTiles: ShortCubeCoords[] = gameMap.getSpiralHexTiles(
      this._centerHex,
      spiralRadiusInTiles
    )

    visibleTiles
      .reduce((acc, coords) => {
        if (gameMap.doesHexExist(coords)) {
          const hexTile = new Hex(coords.q, coords.r)
          const isHighlighted = isEqual(coords, this._hoveredHex)
          const isSelected = isEqual(coords, this._selectedHex)

          let hexType: keyof typeof HEX_TILE_TYPES = 'default'
          if (isSelected) {
            hexType = 'selected'
          } else if (isHighlighted) {
            hexType = 'highlighted'
          }

          const {landscapeType, rotationDeg, isReflected} =
            gameMap.mapScheme[coords.r][coords.q]

          acc.push({
            hexType,
            landscapeType,
            rotationDeg,
            isReflected,
            coords: hexTile.getAxialShiftedCoords(this._hexRadius, this._scale)
          })
        }

        return acc
      }, [] as PreparedForRenderHex[])
      .sort(sortingBeforeRendering)
      .forEach(({hexType, landscapeType, rotationDeg, isReflected, coords}) => {
        this._drawHexTile({hexType, coords})
        this._drawLandscape({landscapeType, rotationDeg, isReflected, coords})
      })
  }

  public clearMap() {
    if (!this._wrapperRef.current) {
      return
    }

    this._existingContexts.forEach((ctx) => {
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.clearRect(0, 0, this._canvasWidth, this._canvasHeight)

      ctx.setTransform(
          this._scale,
          0,
          0,
          this._scale,
          this._offset.x,
          this._offset.y
      )
    })
  }

  /** Private methods */

  private _drawHexTile({
    hexType,
    coords
  }: Pick<PreparedForRenderHex, 'hexType' | 'coords'>) {
    const canvasTemplate =
      this._hexTileTemplatesScheme?.[this.mapMode]?.[hexType]

    if (!this._gridCtx || !canvasTemplate) {
      return
    }

    this._gridCtx.save()
    this._gridCtx.drawImage(
      canvasTemplate,
      coords.x - this._hexRadius,
      coords.y - this._hexRadius
    )
    this._gridCtx.restore()
  }

  private _drawLandscape({
    landscapeType,
    rotationDeg,
    isReflected,
    coords
  }: Omit<PreparedForRenderHex, 'hexType'>) {
    const canvasTemplate =
      this._landscapeTemplatesScheme?.[this.mapMode]?.[landscapeType][
        this.mapMode === 'detailed' ? rotationDeg : 0
      ]

    if (!this._landscapeCtx || !canvasTemplate) {
      return
    }

    this._landscapeCtx.save()

    if (isReflected) {
      this._landscapeCtx.scale(-1, 1)
      this._landscapeCtx.drawImage(
        canvasTemplate,
        (coords.x + this._hexRadius) * -1,
        coords.y - this._hexRadius
      )
      this._landscapeCtx.scale(-1, 1)
    } else {
      this._landscapeCtx.drawImage(
        canvasTemplate,
        coords.x - this._hexRadius,
        coords.y - this._hexRadius
      )
    }

    this._landscapeCtx.restore()
  }

  /** Public getters */

  public get selectedHex() {
    return this._selectedHex
  }

  public get hoveredHex() {
    return this._hoveredHex
  }

  public get centerHex() {
    return this._centerHex
  }

  public get scale() {
    return this._scale
  }

  public get mapMode(): MapMode {
    return this._scale < SCALE.SIMPLIFIED_MAP ? 'simplified' : 'detailed'
  }

  /** Private getters */

  private get _existingContexts() {
    return [this._gridCtx, this._landscapeCtx].filter(
      (ctx) => ctx
    ) as CanvasRenderingContext2D[]
  }

  private get _canvasWidth() {
    return this._wrapperRef.current?.clientWidth || 0
  }

  private get _canvasHeight() {
    return this._wrapperRef.current?.clientHeight || 0
  }

  /** Public setters */

  public set selectedHex(coords) {
    this._selectedHex = coords
    // TODO: make calculations here ?
    this._subscribers.forEach((listener) => listener?.onChangeSelectedHex?.())
  }

  public set hoveredHex(coords) {
    // TODO: make calculations here ?
    this._hoveredHex = coords
  }

  public set scale(newScale) {
    // TODO: make calculations here
    this._scale = newScale
    this._subscribers.forEach((listener) => listener?.onChangeScale?.())
  }
}
