import {HexObj} from '../interfaces'
import {CanvasContextState, MapEdges} from '../../contexts/canvas/interfaces'
import {OFFSET_LIMIT} from '../../constants'

// ---------------------------
const rand = (m = 255, M = m + (m = 0)) => (Math.random() * (M - m) + m) | 0
const objects: any = []
for (let i = 0; i < 750; i++) {
  objects.push({
    x: rand(OFFSET_LIMIT.X-50),
    y: rand(OFFSET_LIMIT.Y-50),
    w: rand(50),
    h: rand(50),
    col: `rgb(${rand()},${rand()},${rand()})`
  })
}
// ===========================

export const drawHex = (ctx: CanvasContextState['ctx'], options: HexObj) => {
  if (!ctx) {
    return
  }

  for (let i = 0; i < objects.length; i++) {
    const obj = objects[i]
    ctx.fillStyle = obj.col
    ctx.fillRect(obj.x, obj.y, obj.h, obj.h)
  }

  // const {coords, radius = 100} = options
  // const {x, y} = coords
  //
  // ctx.save()
  // ctx.beginPath()
  //
  // for (let i = 0; i < 6; i++) {
  //   const angleDeg = 60 * i - 30
  //   const angleRad = (Math.PI / 180) * angleDeg
  //   ctx.lineTo(x + radius * Math.cos(angleRad), y + radius * Math.sin(angleRad))
  // }
  //
  // ctx.closePath()
  // ctx.strokeStyle = '#8f1010'
  // ctx.lineWidth = 2
  // ctx.stroke()
  // ctx.restore()
}


const getMapEdges = (): MapEdges => ({
  top: canvas.originOffset.y,
  right: canvas.originOffset.x + OFFSET_LIMIT.X * canvas.scale,
  bottom: canvas.originOffset.y + OFFSET_LIMIT.Y * canvas.scale,
  left: canvas.originOffset.x
})
