import {CanvasObj} from '../../interfaces'
import {HexObj} from '../interfaces'

export const clearMap = (c: CanvasObj) => {
  c.ctx.clearRect(0, 0, c.ref.width, c.ref.height)
}

export const drawHex = (ctx: CanvasRenderingContext2D, options: HexObj) => {
  const {coords, radius = 100} = options
  const {x, y} = coords

  ctx.save()
  ctx.beginPath()

  for (let i = 0; i < 6; i++) {
    const angleDeg = 60 * i - 30
    const angleRad = (Math.PI / 180) * angleDeg
    ctx.lineTo(x + radius * Math.cos(angleRad), y + radius * Math.sin(angleRad))
  }

  ctx.closePath()
  ctx.strokeStyle = '#8f1010'
  ctx.lineWidth = 2
  ctx.stroke()
  ctx.restore()
}
