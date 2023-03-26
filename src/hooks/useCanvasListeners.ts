import {inRange} from 'lodash'

import {SCALE} from '../constants'
import {drawHex} from '../core/utils/map.utils'
import {CanvasContextState, Position2D} from '../contexts/canvas/interfaces'

export const useCanvasListeners = (canvas: CanvasContextState) => {
  const clearMap = () => {
    if (!canvas.ref || !canvas.ctx) {
      return
    }

    canvas.ctx.setTransform(1, 0, 0, 1, 0, 0)
    canvas.ctx.clearRect(0, 0, canvas.ref.width, canvas.ref.height)
    canvas.isUpdateRequired = false
    canvas.ctx.setTransform(
      canvas.scale,
      0,
      0,
      canvas.scale,
      canvas.originOffset.x,
      canvas.originOffset.y
    )
  }

  const drawCanvas = () => {
    if (canvas.ctx && canvas.isUpdateRequired) {
      clearMap()
      drawHex(canvas.ctx, {radius: 100, coords: {x: 250, y: 500}})
    }

    requestAnimationFrame(drawCanvas)
  }

  const moveOffset = (offsetAmount: Position2D) => {
    canvas.isUpdateRequired = false
    canvas.originOffset.x += offsetAmount.x
    canvas.originOffset.y += offsetAmount.y
    canvas.isUpdateRequired = true
  }

  const scaleAt = (at: Position2D, amount: number) => {
    const newScale = canvas.scale * amount

    if (!inRange(newScale, SCALE.MIN, SCALE.MAX)) {
      return
    }

    canvas.isUpdateRequired = false
    canvas.scale = newScale
    canvas.originOffset.x = at.x - (at.x - canvas.originOffset.x) * amount
    canvas.originOffset.y = at.y - (at.y - canvas.originOffset.y) * amount
    canvas.isUpdateRequired = true
  }

  const onResize = () => {
    if (!canvas.ref) {
      return
    }

    canvas.isUpdateRequired = false

    const rect = canvas.ref.getBoundingClientRect()
    canvas.ref.width = Math.round(rect.width)
    canvas.ref.height = Math.round(rect.height)
    canvas.isUpdateRequired = true
  }

  function mouseEvent(event: MouseEvent) {
    if (event.type === 'mousedown') {
      canvas.mouseState.isButtonPressed = true
    }

    if (event.type === 'mouseup' || event.type === 'mouseout') {
      canvas.mouseState.isButtonPressed = false
    }

    canvas.mouseState.prevX = canvas.mouseState.x
    canvas.mouseState.prevY = canvas.mouseState.y
    canvas.mouseState.x = event.offsetX
    canvas.mouseState.y = event.offsetY

    if (canvas.mouseState.isButtonPressed) {
      moveOffset({
        x: canvas.mouseState.x - canvas.mouseState.prevX,
        y: canvas.mouseState.y - canvas.mouseState.prevY
      })
    }
  }

  function mouseWheelEvent(event: WheelEvent) {
    const {offsetX, offsetY, deltaY} = event
    const delta = deltaY < 0 ? 1.1 : 0.9
    const amount = Number(delta.toFixed(1))

    scaleAt({x: offsetX, y: offsetY}, amount)
    event.preventDefault() // TODO: Check if this required
  }

  const addCanvasListeners = () => {
    if (!canvas.ref) {
      return
    }

    requestAnimationFrame(drawCanvas)

    canvas.ref.addEventListener('mousemove', mouseEvent, {passive: true})
    canvas.ref.addEventListener('mousedown', mouseEvent, {passive: true})
    canvas.ref.addEventListener('mouseup', mouseEvent, {passive: true})
    canvas.ref.addEventListener('mouseout', mouseEvent, {passive: true})
    canvas.ref.addEventListener('wheel', mouseWheelEvent, {passive: false})
    window.addEventListener('orientationchange', onResize, {passive: true})
    window.addEventListener('resize', onResize, {passive: true})
  }

  const removeCanvasListeners = () => {
    if (!canvas.ref) {
      return
    }

    canvas.ref.removeEventListener('mousemove', mouseEvent)
    canvas.ref.removeEventListener('mousedown', mouseEvent)
    canvas.ref.removeEventListener('mouseup', mouseEvent)
    canvas.ref.removeEventListener('mouseout', mouseEvent)
    canvas.ref.removeEventListener('wheel', mouseWheelEvent)
    window.removeEventListener('orientationchange', onResize)
    window.removeEventListener('resize', onResize)
  }

  return {
    addCanvasListeners,
    removeCanvasListeners
  }
}
