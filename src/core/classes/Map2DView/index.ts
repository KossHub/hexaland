import {RefObject} from 'react'

import {AxialCoords, ShortCubeCoords} from '../../../contexts/canvas/interfaces'
import {
  CanvasObject,
  MapEdges,
  MapEventListener,
  PreparedForRenderHex
} from '../../interfaces/map.interfaces'
import {Hex} from '../Hex'
import {
  LandscapeTemplatesScheme,
  HexTilesTemplatesScheme
} from '../../interfaces/hex.interfaces'
import {MapMode} from '../../interfaces/map.interfaces'
import {RectMap} from '../GameMap/RectMap'
import {HexTileTemplates} from '../HexTileTemplates'
import {LandscapeTemplates} from '../LandscapeTemplates'
import {
  GAME_MAP_BORDER_SIZE,
  SCALE,
  ZERO_AXIAL_COORDS,
  ZERO_SHORT_CUBE_COORDS
} from '../../../constants'
import {INIT_CANVAS_OBJECT} from './constants'
import {HEX_TILE_TYPE, HEX_TILE_TYPES} from '../HexTileTemplates/constants'
import {inRange, isEqual} from 'lodash'
import {sortingBeforeRendering} from '../../utils/mapRender'
import {
  getHexTileHeight,
  getHexTileWidth
} from '../../utils/canvasCalculates.utils'

export class Map2DView {
  private _gridCanvas: CanvasObject = {...INIT_CANVAS_OBJECT}
  private _landscapeCanvas: CanvasObject = {...INIT_CANVAS_OBJECT}
  private _selectedHex: null | ShortCubeCoords = null
  private _hoveredHex: null | ShortCubeCoords = null
  private _centerHex: ShortCubeCoords = ZERO_SHORT_CUBE_COORDS
  private _scale: number = SCALE.INIT
  private _offset: AxialCoords = ZERO_AXIAL_COORDS
  private _subscribers: MapEventListener[] = []
  // private _canvasTemplates: null | CanvasTemplates = null

  protected _hexTileTemplatesScheme: null | HexTilesTemplatesScheme = null
  protected _landscapeTemplatesScheme: null | LandscapeTemplatesScheme = null

  constructor(
    gridCanvasRef: RefObject<HTMLCanvasElement>,
    landscapeCanvasRef: RefObject<HTMLCanvasElement>,
    private _wrapperRef: RefObject<HTMLDivElement>,
    private _hexRadius: number,
    onError: () => void
  ) {
    // this._canvasTemplates = new CanvasTemplates(_hexRadius)

    const hexTileTemplates = new HexTileTemplates(_hexRadius)
    this._hexTileTemplatesScheme = hexTileTemplates.scheme

    const landscapeTemplates = new LandscapeTemplates(_hexRadius)
    this._landscapeTemplatesScheme = landscapeTemplates.scheme

    this.initCtx(this._gridCanvas, gridCanvasRef, onError)
    this.initCtx(this._landscapeCanvas, landscapeCanvasRef, onError)
  }

  /** Public methods */

  public subscribe(listener: MapEventListener) {
    this._subscribers.push(listener)
  }

  public unsubscribe(listener: MapEventListener) {
    this._subscribers = this._subscribers.filter((subs) => subs !== listener)
  }

  public updateCenterHex() {
    const newCenterHex =
      this.getHexCubeCoords({
        x: this._canvasWidth / 2,
        y: this._canvasHeight / 2
      }) || ZERO_SHORT_CUBE_COORDS

    this._centerHex = newCenterHex
    this._subscribers.forEach((subs) => subs?.onChangeCenterHex?.(newCenterHex))
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

          let hexType: keyof typeof HEX_TILE_TYPES = HEX_TILE_TYPE.DEFAULT
          if (isSelected) {
            hexType = HEX_TILE_TYPE.SELECTED
          } else if (isHighlighted) {
            hexType = HEX_TILE_TYPE.HIGHLIGHTED
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
        this.drawHexTile({hexType, coords})
        this.drawLandscape({landscapeType, coords, rotationDeg, isReflected})
      })
  }

  public resize() {
    if (!this._wrapperRef.current) {
      return
    }

    const rect = this._wrapperRef.current.getBoundingClientRect()

    this._canvases.forEach(({ref}) => {
      if (ref.current) {
        ref.current.width = Math.round(rect.width)
        ref.current.height = Math.round(rect.height)
      }
    })
  }

  // returns coords even if mouse position is out of game mar area
  public getHexCubeCoords(mousePosition: null | AxialCoords) {
    if (!mousePosition) {
      this.hoveredHex = null
      return null
    }

    const shiftedX =
      mousePosition.x / this._scale - // mouse origin
      this._offset.x / this._scale - // offset
      (Math.sqrt(3) * this._hexRadius) / 2 - // projecting hex part
      GAME_MAP_BORDER_SIZE / this._scale // borders
    const shiftedY =
      mousePosition.y / this._scale - // mouse origin
      this._offset.y / this._scale - // offset
      this._hexRadius - // projecting hex part
      GAME_MAP_BORDER_SIZE / this._scale // borders

    return this.getHexCoords({
      x: shiftedX,
      y: shiftedY
    })
  }

  public scaleAt(
    at: AxialCoords,
    amount: number,
    widthInTiles: number,
    heightInTiles: number
  ) {
    let newScale = this._scale * amount
    let actuallyAmount = amount

    if (!inRange(newScale, SCALE.MIN, SCALE.MAX)) {
      if (newScale < SCALE.MIN) {
        newScale = SCALE.MIN
        actuallyAmount = SCALE.MIN / this._scale
      } else if (newScale > SCALE.MAX) {
        newScale = SCALE.MAX
        actuallyAmount = SCALE.MAX / this._scale
      }
    }

    this._scale = newScale
    const {left, right, top, bottom} = this.getMapEdgesInPixels(
      widthInTiles,
      heightInTiles
    )
    const isXInMapArea = at.x >= left && at.x <= right
    const isYInMapArea = at.y >= top && at.y <= bottom
    const atX =
      isXInMapArea || actuallyAmount < 1 ? at.x : (right - left) / 2 + left
    const atY =
      isYInMapArea || actuallyAmount < 1 ? at.y : (bottom - top) / 2 + top
    this._offset.x = atX - (atX - left) * actuallyAmount
    this._offset.y = atY - (atY - top) * actuallyAmount

    this._subscribers.forEach((subs) => subs?.onChangeScale?.(newScale))
  }

  public moveOffset(
    offsetAmount: AxialCoords,
    widthInTiles: number,
    heightInTiles: number
  ) {
    const {left, right, top, bottom} = this.getMapEdgesInPixels(
      widthInTiles,
      heightInTiles
    )
    const newOffsetX = left + offsetAmount.x
    const isLeftOffsetIncreasing = newOffsetX > left
    const isLeftOffsetDecreasing = newOffsetX < left
    const isIncreaseLeftOffsetAvailable = left < 0 || right < this._canvasWidth
    const isDecreaseLeftOffsetAvailable = left > 0 || right > this._canvasWidth

    if (
      (isLeftOffsetIncreasing && isIncreaseLeftOffsetAvailable) ||
      (isLeftOffsetDecreasing && isDecreaseLeftOffsetAvailable)
    ) {
      this._offset.x = newOffsetX
    }

    const newOffsetY = top + offsetAmount.y
    const isTopOffsetIncreasing = newOffsetY > top
    const isTopOffsetDecreasing = newOffsetY < top
    const isIncreaseTopOffsetAvailable = top < 0 || bottom < this._canvasHeight
    const isDecreaseTopOffsetAvailable = top > 0 || bottom > this._canvasHeight

    if (
      (isTopOffsetIncreasing && isIncreaseTopOffsetAvailable) ||
      (isTopOffsetDecreasing && isDecreaseTopOffsetAvailable)
    ) {
      this._offset.y = newOffsetY
    }
  }

  public clearMap() {
    if (!this._wrapperRef.current) {
      return
    }

    this._canvases.forEach(({ctx}) => {
      if (ctx) {
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
      }
    })
  }

  public getWidthInPixels(widthInTiles: number) {
    const hexTileWidth = getHexTileWidth(this._hexRadius)

    return widthInTiles * hexTileWidth + hexTileWidth / 2
  }

  public getHeightInPixels(heightInTiles: number) {
    return ((heightInTiles * 3) / 2) * this._hexRadius + this._hexRadius / 2
  }

  /** Private methods */

  private initCtx(
    canvasObject: CanvasObject,
    canvas: RefObject<HTMLCanvasElement>,
    onError: () => void
  ) {
    if (!canvas.current?.getContext) {
      onError()
      return
    }

    canvasObject.ref = canvas
    canvasObject.ctx = canvas.current.getContext('2d')

    canvasObject.ref.current!.width = this._canvasWidth
    canvasObject.ref.current!.height = this._canvasHeight
  }

  private drawHexTile({
    hexType,
    coords
  }: Pick<PreparedForRenderHex, 'hexType' | 'coords'>) {
    const canvasTemplate =
      this._hexTileTemplatesScheme?.[this.mapMode]?.[hexType]

    if (!this._gridCanvas.ctx || !canvasTemplate) {
      return
    }

    this._gridCanvas.ctx.save()
    this._gridCanvas.ctx.drawImage(
      canvasTemplate,
      coords.x - this._hexRadius,
      coords.y - this._hexRadius
    )
    this._gridCanvas.ctx.restore()
  }

  private drawLandscape({
    landscapeType,
    coords,
    rotationDeg,
    isReflected
  }: Omit<PreparedForRenderHex, 'hexType'>) {
    const canvasTemplate =
      this.mapMode === 'detailed'
        ? this._landscapeTemplatesScheme?.detailed?.[landscapeType][rotationDeg]
        : this._landscapeTemplatesScheme?.simplified?.[landscapeType]

    if (!this._landscapeCanvas.ctx || !canvasTemplate) {
      return
    }

    this._landscapeCanvas.ctx.save()

    if (isReflected) {
      this._landscapeCanvas.ctx.scale(-1, 1)
      this._landscapeCanvas.ctx.drawImage(
        canvasTemplate,
        (coords.x + this._hexRadius) * -1,
        coords.y - this._hexRadius
      )
      this._landscapeCanvas.ctx.scale(-1, 1)
    } else {
      this._landscapeCanvas.ctx.drawImage(
        canvasTemplate,
        coords.x - this._hexRadius,
        coords.y - this._hexRadius
      )
    }

    this._landscapeCanvas.ctx.restore()
  }

  private getHexCoords(coords: AxialCoords): ShortCubeCoords {
    const {x, y} = coords
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

  private getMapEdgesInPixels(
    widthInTiles: number,
    heightInTiles: number
  ): MapEdges {
    return {
      top: this._offset.y,
      right:
        this._offset.x +
        this.getWidthInPixels(widthInTiles) * this._scale +
        2 * GAME_MAP_BORDER_SIZE,
      bottom:
        this._offset.y +
        this.getHeightInPixels(heightInTiles) * this._scale +
        2 * GAME_MAP_BORDER_SIZE,
      left: this._offset.x
    }
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

  public get wrapperRef() {
    return this._wrapperRef
  }

  /** Private getters */

  private get _canvasWidth() {
    return this._wrapperRef.current?.clientWidth || 0
  }

  private get _canvasHeight() {
    return this._wrapperRef.current?.clientHeight || 0
  }

  private get _canvases() {
    return [this._gridCanvas, this._landscapeCanvas]
  }

  /** Public setters */

  public set selectedHex(coords) {
    this._selectedHex = coords
    this._subscribers.forEach((subs) => subs?.onChangeSelectedHex?.(coords))
  }

  public set hoveredHex(coords) {
    this._hoveredHex = coords
    this._subscribers.forEach((subs) => subs?.onChangeHoveredHex?.(coords))
  }
}
