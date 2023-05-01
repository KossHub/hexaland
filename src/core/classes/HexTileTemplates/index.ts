import {HexTilesTemplatesScheme} from '../../interfaces/hex.interfaces'
import {HEX_TILE_TYPES} from './constants'
import {getCanvasTemplate} from '../../utils/canvasTemplate.utils'
import {drawHexShape} from '../../utils/drawHexShape'

export class HexTileTemplates {
  private _scheme: HexTilesTemplatesScheme = {
    detailed: {},
    simplified: {}
  }

  constructor(radius: number) {
    this.fillTemplates(radius)
  }

  private fillDetailedTemplate(
    radius: number,
    hexType: keyof typeof HEX_TILE_TYPES
  ) {
    const {canvas, ctx} = getCanvasTemplate(radius)
    const {detailedLineColor, detailedLineWidth} = HEX_TILE_TYPES[hexType]

    drawHexShape(ctx, radius)

    ctx.strokeStyle = detailedLineColor
    ctx.lineWidth = detailedLineWidth

    ctx.stroke()

    this._scheme.detailed[hexType] = canvas
  }

  private fillSimplifiedTemplate(
    radius: number,
    hexType: keyof typeof HEX_TILE_TYPES
  ) {
    const color = HEX_TILE_TYPES[hexType]?.simplifiedFillColor

    if (!color) {
      return
    }

    const {canvas, ctx} = getCanvasTemplate(radius)

    drawHexShape(ctx, radius)

    ctx.fillStyle = color

    ctx.fill()

    this._scheme.simplified[hexType] = canvas
  }

  private fillTemplates(radius: number) {
    Object.keys(HEX_TILE_TYPES).forEach((hexType) => {
      this.fillDetailedTemplate(radius, hexType)
      this.fillSimplifiedTemplate(radius, hexType)
    })
  }

  public get scheme() {
    return this._scheme
  }
}
