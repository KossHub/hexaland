import {useEffect, useRef} from 'react'
import {inRange, isEqual} from 'lodash'

import {
  GAME_MAP_BORDER_SIZE,
  SCALE,
  LONG_TOUCH_DURATION_MS,
  ACCEPTABLE_CLICK_OFFSET_PX,
  ZERO_AXIAL_COORDS,
  ZERO_SHORT_CUBE_COORDS,
  CANVAS_FPS
} from '../constants'
import {
  CanvasContextState,
  MapEdgesInPixels,
  AxialCoords,
  ShortCubeCoords,
  CanvasContexts,
  CanvasRefs
} from '../contexts/canvas/interfaces'
import {GameContextState} from '../contexts/game/interfaces'
import {
  getTouchesDistance,
  getTouchesMidpoint
} from '../core/utils/canvasCalculates.utils'

export const useCanvasListeners = (
  canvas: CanvasContextState,
  gameState: GameContextState
) => {
  const {game} = gameState

  const mouseDownInitPos = useRef<AxialCoords>(ZERO_AXIAL_COORDS)
  const mousePrevPos = useRef<AxialCoords>(ZERO_AXIAL_COORDS)
  const isMouseButtonPressed = useRef(false)
  const touchTimeoutId = useRef<null | ReturnType<typeof setTimeout>>(null)
  const drawTimeoutId = useRef<null | ReturnType<typeof setTimeout>>(null)
  const initTouch = useRef<null | Touch>(null)
  const prevTouches = useRef<Touch[]>([])
  const prevMidpoint = useRef<AxialCoords>(ZERO_AXIAL_COORDS)
  const prevTouchesDistance = useRef(0)
  const centerHexCoords = useRef<ShortCubeCoords>(ZERO_SHORT_CUBE_COORDS)

  useEffect(() => {
    return () => {
      if (touchTimeoutId.current) {
        clearTimeout(touchTimeoutId.current)
      }

      if (drawTimeoutId.current) {
        clearTimeout(drawTimeoutId.current)
      }

      initTouch.current = null
      drawTimeoutId.current = null
    }
  }, [])

  const clearMap = () => {
    if (
      !canvas.wrapperRef ||
      Object.values(canvas.contexts).some((ctx) => !ctx)
    ) {
      return
    }

    const width = canvas.wrapperRef?.clientWidth || 0
    const height = canvas.wrapperRef?.clientHeight || 0

    Object.keys(canvas.contexts).forEach((key) => {
      const ctx = canvas.contexts[
        key as keyof CanvasContexts
      ] as CanvasRenderingContext2D

      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.clearRect(0, 0, width, height)

      if (key === 'landscape') {
        ctx.fillStyle = '#FAFCFF'
        ctx.fillRect(0, 0, width, height)
      }

      ctx.setTransform(
        canvas.scale,
        0,
        0,
        canvas.scale,
        canvas.originOffset.x,
        canvas.originOffset.y
      )
    })
  }

  const drawCanvas = () => {
    if (canvas.wrapperRef && game && game?.gameMap) {
      clearMap()
      game.gameMap.drawHexTiles(
        canvas,
        centerHexCoords.current,
        game.hoveredHex,
        game.selectedHex
      )
      setTimeout(() => {
        requestAnimationFrame(drawCanvas)
      }, 1000 / CANVAS_FPS)
    } else if (drawTimeoutId.current) {
      clearTimeout(drawTimeoutId.current)
      drawTimeoutId.current = null
    }
  }

  const getMapEdgesInPixels = (): MapEdgesInPixels => ({
    top: canvas.originOffset.y,
    right:
      canvas.originOffset.x +
      game!.gameMap!.widthInPixels * canvas.scale +
      2 * GAME_MAP_BORDER_SIZE,
    bottom:
      canvas.originOffset.y +
      game!.gameMap!.heightInPixels * canvas.scale +
      2 * GAME_MAP_BORDER_SIZE,
    left: canvas.originOffset.x
  })

  /** returns coords even out of game mar area */
  const getHexCubeCoords = (mousePosition: null | AxialCoords) => {
    if (!game?.gameMap) {
      return null
    }

    if (!mousePosition) {
      game.hoveredHex = null
      return null
    }

    const shiftedX =
      mousePosition.x / canvas.scale - // mouse origin
      canvas.originOffset.x / canvas.scale - // offset
      (Math.sqrt(3) * game.gameMap.hexRadius) / 2 - // projecting hex part
      GAME_MAP_BORDER_SIZE / canvas.scale // border
    const shiftedY =
      mousePosition.y / canvas.scale - // mouse origin
      canvas.originOffset.y / canvas.scale - // offset
      game.gameMap.hexRadius - // projecting hex part
      GAME_MAP_BORDER_SIZE / canvas.scale // border

    return game.gameMap.getHexCoords({
      x: shiftedX,
      y: shiftedY
    })
  }

  const updateCenterHex = () => {
    const canvasWidth = canvas.wrapperRef?.clientWidth || 0
    const canvasHeight = canvas.wrapperRef?.clientHeight || 0
    centerHexCoords.current =
      getHexCubeCoords({
        x: canvasWidth / 2,
        y: canvasHeight / 2
      }) || ZERO_SHORT_CUBE_COORDS
  }

  const moveOffset = (offsetAmount: AxialCoords) => {
    const {left, right, top, bottom} = getMapEdgesInPixels()

    const windowWidth = canvas.wrapperRef?.clientWidth || 0
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

    const windowHeight = canvas.wrapperRef?.clientHeight || 0
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
  }

  const scaleAt = (at: AxialCoords, amount: number) => {
    let newScale = canvas.scale * amount
    let actuallyAmount = amount

    if (!inRange(newScale, SCALE.MIN, SCALE.MAX)) {
      if (newScale < SCALE.MIN) {
        newScale = SCALE.MIN
        actuallyAmount = SCALE.MIN / canvas.scale
      } else if (newScale > SCALE.MAX) {
        newScale = SCALE.MAX
        actuallyAmount = SCALE.MAX / canvas.scale
      }
    }

    canvas.scale = newScale
    const {left, right, top, bottom} = getMapEdgesInPixels()
    const isXInMapArea = at.x >= left && at.x <= right
    const isYInMapArea = at.y >= top && at.y <= bottom
    const atX =
      isXInMapArea || actuallyAmount < 1 ? at.x : (right - left) / 2 + left
    const atY =
      isYInMapArea || actuallyAmount < 1 ? at.y : (bottom - top) / 2 + top
    canvas.originOffset.x = atX - (atX - left) * actuallyAmount
    canvas.originOffset.y = atY - (atY - top) * actuallyAmount
  }

  const setHoveredHex = (mousePosition: null | AxialCoords) => {
    if (!game) {
      return
    }

    const hexCoords = getHexCubeCoords(mousePosition)
    game.hoveredHex =
      hexCoords && game.gameMap!.doesHexExist(hexCoords) ? hexCoords : null
  }

  const setSelectedHex = (mousePosition: null | AxialCoords) => {
    if (!game) {
      return
    }

    const hexCoords = getHexCubeCoords(mousePosition)
    game.selectedHex =
      hexCoords &&
      game.gameMap!.doesHexExist(hexCoords) &&
      isEqual(hexCoords, game.selectedHex)
        ? null
        : hexCoords
  }

  const onResize = () => {
    if (!canvas.wrapperRef) {
      return
    }

    const rect = canvas.wrapperRef.getBoundingClientRect()

    Object.keys(canvas.refs).forEach((key) => {
      const canvasRef = canvas.refs[
        key as keyof CanvasRefs
      ] as HTMLCanvasElement
      canvasRef.width = Math.round(rect.width)
      canvasRef.height = Math.round(rect.height)
    })

    setHoveredHex(null)
    updateCenterHex()
  }

  const mouseEvent = (event: MouseEvent) => {
    if (event.type === 'mousedown') {
      mouseDownInitPos.current = {
        x: event.offsetX,
        y: event.offsetY
      }
      isMouseButtonPressed.current = true
    }

    if (event.type === 'mouseup' || event.type === 'mouseout') {
      isMouseButtonPressed.current = false
    }

    if (event.type === 'mouseout') {
      setHoveredHex(null)
    }

    if (isMouseButtonPressed.current) {
      moveOffset({
        x: event.offsetX - mousePrevPos.current.x,
        y: event.offsetY - mousePrevPos.current.y
      })
      updateCenterHex()
    }

    const isOffsetWithinAcceptable =
      Math.abs(mouseDownInitPos.current.x - event.offsetX) <=
        ACCEPTABLE_CLICK_OFFSET_PX &&
      Math.abs(mouseDownInitPos.current.y - event.offsetY) <=
        ACCEPTABLE_CLICK_OFFSET_PX

    if (event.type === 'mouseup' && isOffsetWithinAcceptable) {
      setSelectedHex({
        x: mouseDownInitPos.current.x,
        y: mouseDownInitPos.current.y
      })
    }

    if (event.type === 'mousemove') {
      setHoveredHex({x: event.offsetX, y: event.offsetY})
    }

    mousePrevPos.current = {
      x: event.offsetX,
      y: event.offsetY
    }
  }

  const onTouchStart = (event: TouchEvent) => {
    event.preventDefault()

    const touch1 = event.touches[0]
    const touch2 = event.touches[1]

    if (event.touches.length === 1) {
      initTouch.current = touch1
      prevTouches.current = [touch1]
      touchTimeoutId.current = setTimeout(() => {
        initTouch.current = null
      }, LONG_TOUCH_DURATION_MS)
    } else if (event.touches.length === 2) {
      prevTouchesDistance.current = getTouchesDistance(touch1, touch2)
      prevMidpoint.current = getTouchesMidpoint(touch1, touch2)
    } else {
      prevTouches.current = []
    }
  }

  const onTouchMove = (event: TouchEvent) => {
    event.preventDefault()

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

    updateCenterHex()
  }

  const onTouchEnd = () => {
    const [prevTouch] = prevTouches.current

    if (!initTouch.current || !prevTouch) {
      return
    }

    const {clientX, clientY} = initTouch.current

    const isOffsetWithinAcceptable =
      Math.abs(prevTouch.clientX - clientX) <= ACCEPTABLE_CLICK_OFFSET_PX &&
      Math.abs(prevTouch.clientY - clientY) <= ACCEPTABLE_CLICK_OFFSET_PX

    if (isOffsetWithinAcceptable) {
      setSelectedHex({x: clientX, y: clientY})
    }

    if (touchTimeoutId.current) {
      clearTimeout(touchTimeoutId.current)
    }

    initTouch.current = null
  }

  const mouseWheelEvent = (event: WheelEvent) => {
    event.preventDefault() // TODO: Check if all preventDefault required on this page

    const {offsetX, offsetY, deltaY} = event
    // TODO: possible point to optimize - use limited length after dot scale value
    const delta = deltaY < 0 ? 1.1 : 1 / 1.1

    scaleAt({x: offsetX, y: offsetY}, delta)

    // to avoid case with hover on scroll and without cursor (e.g. desktop chrome in mobile dev mode)
    if (game?.hoveredHex) {
      setHoveredHex({x: offsetX, y: offsetY})
    }

    updateCenterHex()
  }

  const addCanvasListeners = () => {
    if (!canvas.wrapperRef) {
      return
    }

    updateCenterHex()
    requestAnimationFrame(drawCanvas)

    canvas.wrapperRef.addEventListener('mousemove', mouseEvent, {passive: true})
    canvas.wrapperRef.addEventListener('mousedown', mouseEvent, {passive: true})
    canvas.wrapperRef.addEventListener('mouseup', mouseEvent, {passive: true})
    canvas.wrapperRef.addEventListener('mouseout', mouseEvent, {passive: true})
    canvas.wrapperRef.addEventListener('touchstart', onTouchStart)
    canvas.wrapperRef.addEventListener('touchmove', onTouchMove)
    canvas.wrapperRef.addEventListener('touchend', onTouchEnd)
    canvas.wrapperRef.addEventListener('wheel', mouseWheelEvent)
    window.addEventListener('resize', onResize, {passive: true})
  }

  const removeCanvasListeners = () => {
    if (!canvas.wrapperRef) {
      return
    }

    clearMap()

    canvas.wrapperRef.removeEventListener('mousemove', mouseEvent)
    canvas.wrapperRef.removeEventListener('mousedown', mouseEvent)
    canvas.wrapperRef.removeEventListener('mouseup', mouseEvent)
    canvas.wrapperRef.removeEventListener('mouseout', mouseEvent)
    canvas.wrapperRef.removeEventListener('touchstart', onTouchStart)
    canvas.wrapperRef.removeEventListener('touchmove', onTouchMove)
    canvas.wrapperRef.removeEventListener('touchend', onTouchEnd)
    canvas.wrapperRef.removeEventListener('wheel', mouseWheelEvent)
    window.removeEventListener('resize', onResize)
  }

  return {
    addCanvasListeners,
    removeCanvasListeners
  }
}
