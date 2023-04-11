import {
  CanvasTemplatesScheme,
  MapDrawnType
} from '../../interfaces/hex.interfaces'
import {getCanvasTemplate} from '../../utils/canvasTemplate.utils'
import {HEX_TILE_TYPES} from './constants'
import {DrawnTemplates} from '../DrawnTemplates'
import {drawHexShape} from '../../utils/drawHexShape'

export class HexTileTemplates extends DrawnTemplates {
  protected _scheme: CanvasTemplatesScheme<keyof typeof HEX_TILE_TYPES> = {
    detailed: {},
    simplified: {}
  }

  constructor(radius: number) {
    super()
    this.fillTemplates(radius)
  }

  protected fillTemplates(radius: number) {
    Object.keys(HEX_TILE_TYPES).forEach((hexType) => {
      Object.keys(this._scheme).forEach((schemeKey) => {
        const {canvas, ctx} = getCanvasTemplate(radius)

        const color = HEX_TILE_TYPES[hexType][schemeKey as MapDrawnType]

        if (color) {
          drawHexShape(ctx, radius)

          switch (hexType) {
            case 'selected': {
              if (schemeKey === 'detailed') {
                ctx.strokeStyle = color
                ctx.lineWidth = 3
                ctx.stroke()
              } else if (schemeKey === 'simplified') {
                ctx.fillStyle = color
                ctx.fill()
              }
              break
            }
            case 'highlighted':
            default: {
              ctx.strokeStyle = color
              ctx.lineWidth = 2
              ctx.stroke()
              break
            }
          }

          this._scheme[schemeKey as MapDrawnType][hexType] = canvas
        }
      })
    })
  }
}
