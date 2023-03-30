import {useRef} from 'react'
import {inRange} from 'lodash'

import {GAME_MAP_BORDER_SIZE, SCALE} from '../constants'
import {
  CanvasContextState,
  MapEdgesInPixels,
  AxialCoordinates
} from '../contexts/canvas/interfaces'
import {
  getTouchesDistance,
  getTouchesMidpoint
} from '../core/utils/canvasCalculates.utils'
import {GameMapContextState} from '../contexts/gameMap/interfaces'

export const useCanvasListeners = (
  canvas: CanvasContextState,
  gameMapState: GameMapContextState
) => {
  const mousePrevPos = useRef<AxialCoordinates>({x: 0, y: 0})
  const isMouseButtonPressed = useRef(false)
  const prevTouches = useRef<Touch[]>([])
  const prevMidpoint = useRef<AxialCoordinates>({x: 0, y: 0})
  const prevTouchesDistance = useRef(0)
  const isUpdateRequired = useRef(true)

  const clearMap = () => {
    if (!canvas.ref || !canvas.ctx) {
      return
    }

    canvas.ctx.setTransform(1, 0, 0, 1, 0, 0)
    canvas.ctx.clearRect(0, 0, canvas.ref.width, canvas.ref.height)
    isUpdateRequired.current = false
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
    if (canvas.ctx && isUpdateRequired.current && gameMapState.gameMap) {
      clearMap()
      gameMapState.gameMap.drawHexTiles(canvas.ctx)
    }

    requestAnimationFrame(drawCanvas)
  }

  const getMapEdgesInPixels = (): MapEdgesInPixels => ({
    top: canvas.originOffset.y,
    right:
      canvas.originOffset.x +
      gameMapState.gameMap!.widthInPixels * canvas.scale +
      2 * GAME_MAP_BORDER_SIZE * canvas.scale,
    bottom:
      canvas.originOffset.y +
      gameMapState.gameMap!.heightInPixels * canvas.scale +
      2 * GAME_MAP_BORDER_SIZE * canvas.scale,
    left: canvas.originOffset.x
  })

  const moveOffset = (offsetAmount: AxialCoordinates) => {
    isUpdateRequired.current = false

    const {left, right, top, bottom} = getMapEdgesInPixels()

    const windowWidth = canvas.ref?.width || 0
    const newOffsetX = left + offsetAmount.x
    const isLeftOffsetIncreasing = newOffsetX > left
    const isLeftOffsetDecreasing = newOffsetX < left
    const isIncreaseLeftOffsetAvailable = left < 0 || right < windowWidth
    const isDecreaseLeftOffsetAvailable = left > 0 || right > windowWidth

    if (
      (isLeftOffsetIncreasing && isIncreaseLeftOffsetAvailable) ||
      (isLeftOffsetDecreasing && isDecreaseLeftOffsetAvailable)
    ) {
      canvas.originOffset.x = newOffsetX
    }

    const windowHeight = canvas.ref?.height || 0
    const newOffsetY = top + offsetAmount.y
    const isTopOffsetIncreasing = newOffsetY > top
    const isTopOffsetDecreasing = newOffsetY < top
    const isIncreaseTopOffsetAvailable = top < 0 || bottom < windowHeight
    const isDecreaseTopOffsetAvailable = top > 0 || bottom > windowHeight

    if (
      (isTopOffsetIncreasing && isIncreaseTopOffsetAvailable) ||
      (isTopOffsetDecreasing && isDecreaseTopOffsetAvailable)
    ) {
      canvas.originOffset.y = newOffsetY
    }

    isUpdateRequired.current = true
  }

  const scaleAt = (at: AxialCoordinates, amount: number) => {
    const newScale = canvas.scale * amount

    if (!inRange(newScale, SCALE.MIN, SCALE.MAX)) {
      return
    }

    isUpdateRequired.current = false
    canvas.scale = newScale
    const {left, right, top, bottom} = getMapEdgesInPixels()
    const isXInMapArea = at.x >= left && at.x <= right
    const isYInMapArea = at.y >= top && at.y <= bottom
    const atX = isXInMapArea || amount < 1 ? at.x : (right - left) / 2 + left
    const atY = isYInMapArea || amount < 1 ? at.y : (bottom - top) / 2 + top
    canvas.originOffset.x = atX - (atX - left) * amount
    canvas.originOffset.y = atY - (atY - top) * amount
    isUpdateRequired.current = true
  }

  const onResize = () => {
    if (!canvas.ref) {
      return
    }

    isUpdateRequired.current = false
    const rect = canvas.ref.getBoundingClientRect()
    canvas.ref.width = Math.round(rect.width)
    canvas.ref.height = Math.round(rect.height)
    isUpdateRequired.current = true
  }

  const mouseEvent = (event: MouseEvent) => {
    if (event.type === 'mousedown') {
      isMouseButtonPressed.current = true
    }

    if (event.type === 'mouseup' || event.type === 'mouseout') {
      isMouseButtonPressed.current = false
    }

    if (isMouseButtonPressed.current) {
      moveOffset({
        x: event.offsetX - mousePrevPos.current.x,
        y: event.offsetY - mousePrevPos.current.y
      })
    }

    mousePrevPos.current = {
      x: event.offsetX,
      y: event.offsetY
    }
  }

  const onTouchStart = (event: TouchEvent) => {
    const touch1 = event.touches[0]
    const touch2 = event.touches[1]

    if (event.touches.length === 1) {
      prevTouches.current = [touch1]
    } else if (event.touches.length === 2) {
      prevTouchesDistance.current = getTouchesDistance(touch1, touch2)
      prevMidpoint.current = getTouchesMidpoint(touch1, touch2)
    } else {
      prevTouches.current = []
    }

    event.preventDefault()
  }

  const onTouchMove = (event: TouchEvent) => {
    const touch1 = event.touches[0]
    const touch2 = event.touches[1]

    if (event.touches.length === 1 && touch1) {
      moveOffset({
        x: touch1.clientX - prevTouches.current[0].clientX,
        y: touch1.clientY - prevTouches.current[0].clientY
      })

      prevTouches.current = [event.touches[0]]
    } else {
      prevTouches.current = []
    }

    if (event.touches.length === 2) {
      const distance = getTouchesDistance(touch1, touch2)
      const delta = distance / prevTouchesDistance.current

      const midpoint = getTouchesMidpoint(touch1, touch2)

      scaleAt(midpoint, delta)
      moveOffset({
        x: midpoint.x - prevMidpoint.current.x,
        y: midpoint.y - prevMidpoint.current.y
      })

      prevMidpoint.current = midpoint
      prevTouchesDistance.current = distance
    }

    event.preventDefault()
  }

  const mouseWheelEvent = (event: WheelEvent) => {
    const {offsetX, offsetY, deltaY} = event
    const delta = deltaY < 0 ? 1.1 : 1 / 1.1

    scaleAt({x: offsetX, y: offsetY}, delta)
    event.preventDefault() // TODO: Check if all preventDefault required on this page
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
    canvas.ref.addEventListener('touchstart', onTouchStart)
    canvas.ref.addEventListener('touchmove', onTouchMove)
    canvas.ref.addEventListener('wheel', mouseWheelEvent)
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
    canvas.ref.removeEventListener('touchstart', onTouchStart)
    canvas.ref.removeEventListener('touchmove', onTouchMove)
    canvas.ref.removeEventListener('wheel', mouseWheelEvent)
    window.removeEventListener('resize', onResize)
  }

  return {
    addCanvasListeners,
    removeCanvasListeners
  }
}
