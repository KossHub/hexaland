import {useCallback, useRef} from 'react'
import {inRange} from 'lodash'

import {CanvasObj} from '../interfaces'
import {SCALE} from '../constants'
import {clearMap, drawHex} from '../core/utils/map.utils'
import {HexObj} from '../core/interfaces'

export const useCanvasZoom = (canvas: CanvasObj) => {
  const scaleRef = useRef(SCALE.INIT)

  const onWheel = useCallback(
    (event: WheelEvent) => {
      const scale = scaleRef.current
      // const delta = event.deltaY > 0 ? -0.1 : 0.1
      //
      // const newZoomLevel = parseFloat((scale.current + delta).toFixed(1))
      //
      // if (inRange(newZoomLevel, SCALE.MIN, SCALE.MAX)) {
      //   scale.current = newZoomLevel
      //   clearMap(canvas)
      //   canvas.ctx.scale(1 + delta, 1 + delta)
      //   drawHex(canvas.ctx, {coords: {x: 200, y: 200}})
      // }
      const {x, y} = canvas.cursorPos

      const delta = event.deltaY < 0 ? 0.1 : -0.1
      const newScale = parseFloat((scale + delta).toFixed(1))

      if (!inRange(newScale, SCALE.MIN, SCALE.MAX)) {
        return
      }
      scaleRef.current = newScale
      clearMap(canvas)
      canvas.ctx.setTransform(newScale, 0, 0, newScale, x, y)
      // drawHex(canvas.ctx, {coords: {x: 200, y: 200}})
      drawRnd()
    },
    [canvas.ref, canvas.ctx]
  )

  const onResize = useCallback(() => {
    scaleRef.current = SCALE.INIT
    canvas.ref.width = Math.round(canvas.ref.offsetWidth)
    canvas.ref.height = Math.round(canvas.ref.offsetHeight)
    // drawHex(canvas.ctx, {coords: {x: 200, y: 200}})
    drawRnd()
  }, [canvas.ref, canvas.ctx])

  const addZoomListener = () => {
    canvas.ref.addEventListener('wheel', onWheel)
    window.addEventListener('orientationchange', onResize)
    window.addEventListener('resize', onResize)
  }

  const removeZoomListener = () => {
    canvas.ref.removeEventListener('wheel', onWheel)
    window.removeEventListener('orientationchange', onResize)
    window.removeEventListener('resize', onResize)
  }

  const rand = (m = 255, M = m + (m = 0)) => (Math.random() * (M - m) + m) | 0
  const objects: any = []
  for (let i = 0; i < 100; i++) {
    objects.push({
      x: rand(1000),
      y: rand(800),
      w: rand(40),
      h: rand(40),
      col: `rgb(${rand()},${rand()},${rand()})`
    })
  }

  const drawRnd = () => {
    const {ctx} = canvas
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.clearRect(0, 0, canvas.ref.width, canvas.ref.height)

    ctx.setTransform(
      scaleRef.current,
      0,
      0,
      scaleRef.current,
      canvas.cursorPos.x,
      canvas.cursorPos.y
    )
    for (let i = 0; i < objects.length; i++) {
      const obj = objects[i]
      ctx.fillStyle = obj.col
      ctx.fillRect(obj.x, obj.y, obj.h, obj.h)
    }
  }

  return {
    addZoomListener,
    removeZoomListener
  }
}
