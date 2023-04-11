import {
  CanvasTemplatesScheme,
  MapDrawnType
} from '../../interfaces/hex.interfaces'
import {getCanvasTemplate} from '../../utils/canvasTemplate.utils'
import {LANDSCAPE_TYPES} from './constants'
import {DrawnTemplates} from '../DrawnTemplates'
import {drawHexShape} from '../../utils/drawHexShape'

export class LandscapeTemplates extends DrawnTemplates {
  protected _scheme: CanvasTemplatesScheme<keyof typeof LANDSCAPE_TYPES> = {
    detailed: {},
    simplified: {}
  }

  constructor(radius: number) {
    super()
    this.fillTemplates(radius)
  }

  protected fillTemplates(radius: number) {
    Object.keys(LANDSCAPE_TYPES).forEach((landscapeType) => {
      Object.keys(this._scheme).forEach((schemeKey) => {
        const {canvas, ctx} = getCanvasTemplate(radius)
        // assetPath or color
        const value = LANDSCAPE_TYPES[landscapeType][schemeKey as MapDrawnType]

        if (value) {
          if (schemeKey === 'detailed') {
            const size = radius * 2
            const img = new Image(size, size)

            img.src = `./assets/landscape/${value}`
            img.onload = () => {
              // TEMPLATE ROTATION
              // templateCtx.translate( size / 2, size / 2 );
              // templateCtx.rotate( random(0, 5) * 60 * Math.PI/180 );
              // templateCtx.translate( -size / 2, -size / 2 );
              ctx.drawImage(img, 0, 0, size, size)
            }
          } else if (schemeKey === 'simplified') {
            drawHexShape(ctx, radius + 1) // + 1 to avoid gaps
            ctx.fillStyle = value
            ctx.fill()
          }

          this._scheme[schemeKey as MapDrawnType][landscapeType] = canvas
        }
      })
    })
  }

  public get scheme() {
    return this._scheme
  }
}
