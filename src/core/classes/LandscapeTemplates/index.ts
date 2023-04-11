import {
  CanvasLandscapeTemplatesScheme,
  MapDrawnType
} from '../../interfaces/hex.interfaces'
import {getCanvasTemplate} from '../../utils/canvasTemplate.utils'
import {LANDSCAPE_TYPES, ROTATION_DEG} from './constants'
import {DrawnTemplates} from '../DrawnTemplates'
import {drawHexShape} from '../../utils/drawHexShape'

export class LandscapeTemplates extends DrawnTemplates {
  protected _scheme: CanvasLandscapeTemplatesScheme = {
    detailed: {},
    simplified: {}
  }

  constructor(radius: number) {
    super()
    this.fillTemplates(radius)
  }

  private fillTemplate(
    radius: number,
    landscapeType: string,
    schemeKey: string,
    rotationDeg: number
  ) {
    const {canvas, ctx} = getCanvasTemplate(radius)
    // assetPath or color
    const value = LANDSCAPE_TYPES[landscapeType][schemeKey as MapDrawnType]

    if (value) {
      if (schemeKey === 'detailed') {
        const size = radius * 2
        const img = new Image(size, size)

        img.src = `./assets/landscape/${value}`
        img.onload = () => {
          ctx.translate(size / 2, size / 2)
          ctx.rotate((rotationDeg * Math.PI) / 180)
          ctx.translate(-size / 2, -size / 2)
          ctx.drawImage(img, 0, 0, size, size)
        }
      } else if (schemeKey === 'simplified') {
        drawHexShape(ctx, radius)
        ctx.fillStyle = value
        ctx.fill()
      }

      const scheme = this._scheme[schemeKey as MapDrawnType]

      if (!(landscapeType in scheme)) {
        scheme[landscapeType] = {}
      }

      scheme[landscapeType][rotationDeg] = canvas
    }
  }

  protected fillTemplates(radius: number) {
    Object.keys(LANDSCAPE_TYPES).forEach((landscapeType) => {
      Object.keys(this._scheme).forEach((schemeKey) => {
        if (schemeKey === 'simplified') {
          this.fillTemplate(radius, landscapeType, schemeKey, 0)
        } else {
          ROTATION_DEG.forEach((n) => {
            this.fillTemplate(radius, landscapeType, schemeKey, n)
          })
        }
      })
    })
  }

  public get scheme() {
    return this._scheme
  }
}
