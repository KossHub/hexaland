import {LandscapeTemplatesScheme} from '../../interfaces/hex.interfaces'
import {LANDSCAPES, ROTATION_DEG} from './constants'
import {getCanvasTemplate} from '../../utils/canvasTemplate.utils'
import {drawHexShape} from '../../utils/drawHexShape'

export class LandscapeTemplates {
  private _scheme: LandscapeTemplatesScheme = {
    detailed: {},
    simplified: {}
  }

  constructor(radius: number) {
    this.fillTemplates(radius)
  }

  private fillDetailedTemplate(
    radius: number,
    landscapeType: string,
    rotationDeg: number
  ) {
    const {canvas, ctx} = getCanvasTemplate(radius)
    const assetName = LANDSCAPES[landscapeType].imageName
    const size = radius * 2
    const img = new Image(size, size)

    img.src = `./assets/landscape/${assetName}`
    img.onload = () => {
      ctx.translate(size / 2, size / 2)
      ctx.rotate((rotationDeg * Math.PI) / 180)
      ctx.translate(-size / 2, -size / 2)
      ctx.drawImage(img, 0, 0, size, size)
    }

    const scheme = this._scheme.detailed

    if (!(landscapeType in scheme)) {
      scheme[landscapeType] = {}
    }

    scheme[landscapeType][rotationDeg] = canvas
  }

  private fillSimplifiedTemplate(radius: number, landscapeType: string) {
    const {canvas, ctx} = getCanvasTemplate(radius)

    drawHexShape(ctx, radius)
    ctx.fillStyle = LANDSCAPES[landscapeType].color
    ctx.fill()

    const scheme = this._scheme.simplified

    scheme[landscapeType] = canvas
  }

  private fillTemplates(radius: number) {
    Object.keys(LANDSCAPES).forEach((landscapeType) => {
      ROTATION_DEG.forEach((deg) => {
        this.fillDetailedTemplate(radius, landscapeType, deg)
      })

      this.fillSimplifiedTemplate(radius, landscapeType)
    })
  }

  public get scheme() {
    return this._scheme
  }
}
