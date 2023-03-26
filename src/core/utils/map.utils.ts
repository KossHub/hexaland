import {HexObj} from '../interfaces'
import {CanvasContextState} from '../../contexts/canvas/interfaces'

export const clearMap = (canvas: CanvasContextState) => {
  const {ref, ctx, scale, originOffset} = canvas
  if (!ref || !ctx) {
    return
  }

  ctx.setTransform(1, 0, 0, 1, 0, 0)
  ctx.clearRect(0, 0, ref.width, ref.height)
  canvas.isUpdateRequired = false
  ctx.setTransform(scale, 0, 0, scale, originOffset.x, originOffset.y)
}

/** -------------------------------- */
const rand = (m = 255, M = m + (m = 0)) => (Math.random() * (M - m) + m) | 0
const objects: any = []
for (let i = 0; i < 100; i++) {
  objects.push({
    x: rand(1000),
    y: rand(750),
    w: rand(40),
    h: rand(40),
    col: `rgb(${rand()},${rand()},${rand()})`
  })
}
/** =============================== */

export const drawHex = (ctx: CanvasContextState['ctx'], options: HexObj) => {
  if (!ctx) {
    return
  }

  /** -------------------------------- */
  // for (let i = 0; i < objects.length; i++) {
  //   const obj = objects[i]
  //   ctx.fillStyle = obj.col
  //   ctx?.fillRect(obj.x, obj.y, obj.h, obj.h)
  // }
  /** =============================== */

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
