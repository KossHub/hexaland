import {useEffect, useRef} from 'react'
import {isEqual} from 'lodash'

import {
  SCALE,
  LONG_TOUCH_DURATION_MS,
  ACCEPTABLE_CLICK_OFFSET_PX,
  ZERO_AXIAL_COORDS,
  CANVAS_FPS
} from '../constants'
import {AxialCoords} from '../contexts/canvas/interfaces'
import {MapContextState} from '../contexts/map/interfaces'
import {
  getTouchesDistance,
  getTouchesMidpoint
} from '../core/utils/canvasCalculates.utils'
import {Map2DViewContextState} from '../contexts/map2DView/interfaces'

export const useCanvasListeners = (
  map2DViewRef: Map2DViewContextState,
  mapState: MapContextState
) => {
  const mouseDownInitPos = useRef<AxialCoords>(ZERO_AXIAL_COORDS)
  const mousePrevPos = useRef<AxialCoords>(ZERO_AXIAL_COORDS)
  const isMouseButtonPressed = useRef(false)
  const touchTimeoutId = useRef<null | ReturnType<typeof setTimeout>>(null)
  const drawTimeoutId = useRef<null | ReturnType<typeof setTimeout>>(null)
  const initTouch = useRef<null | Touch>(null)
  const prevTouches = useRef<Touch[]>([])
  const prevMidpoint = useRef<AxialCoords>(ZERO_AXIAL_COORDS)
  const prevTouchesDistance = useRef(0)

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

  const drawCanvas = () => {
    if (map2DViewRef.current && mapState.mapRef.current) {
      map2DViewRef.current.drawMap(mapState.mapRef.current)

      setTimeout(() => {
        requestAnimationFrame(drawCanvas)
      }, 1000 / CANVAS_FPS)
    } else if (drawTimeoutId.current) {
      clearTimeout(drawTimeoutId.current)

      drawTimeoutId.current = null
    }
  }

  const setHoveredHex = (mousePosition: null | AxialCoords) => {
    if (
      !map2DViewRef.current ||
      map2DViewRef.current.scale < SCALE.SIMPLIFIED_MAP
    ) {
      return
    }

    const hexCoords = map2DViewRef.current.getHexCubeCoords(mousePosition)

    map2DViewRef.current.hoveredHex =
      hexCoords && mapState.mapRef.current?.doesHexExist(hexCoords)
        ? hexCoords
        : null
  }

  const setSelectedHex = (mousePosition: null | AxialCoords) => {
    if (
      !map2DViewRef.current ||
      map2DViewRef.current.scale < SCALE.SIMPLIFIED_MAP
    ) {
      return
    }

    const hexCoords = map2DViewRef.current.getHexCubeCoords(mousePosition)

    map2DViewRef.current.selectedHex =
      hexCoords &&
      mapState.mapRef.current?.doesHexExist(hexCoords) &&
      !isEqual(hexCoords, map2DViewRef.current.selectedHex)
        ? hexCoords
        : null
  }

  useEffect(() => {
    if (
      !map2DViewRef.current?.wrapperRef.current ||
      !mapState.mapRef.current ||
      !mapState.isInitialized
    ) {
      return
    }

    const {wrapperRef} = map2DViewRef.current

    const mouseEvent = (event: MouseEvent) => {
      if (!map2DViewRef.current || !mapState.mapRef.current) {
        return
      }

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
        map2DViewRef.current.moveOffset(
          {
            x: event.offsetX - mousePrevPos.current.x,
            y: event.offsetY - mousePrevPos.current.y
          },
          mapState.mapRef.current?.widthInTiles,
          mapState.mapRef.current?.heightInTiles
        )
        map2DViewRef.current.updateCenterHex()
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

      if (!map2DViewRef.current || !mapState.mapRef.current) {
        return
      }

      const touch1 = event.touches[0]
      const touch2 = event.touches[1]
      const {widthInTiles, heightInTiles} = mapState.mapRef.current

      if (event.touches.length === 1 && touch1) {
        map2DViewRef.current.moveOffset(
          {
            x: touch1.clientX - prevTouches.current[0].clientX,
            y: touch1.clientY - prevTouches.current[0].clientY
          },
          widthInTiles,
          heightInTiles
        )

        prevTouches.current = [event.touches[0]]
      } else {
        prevTouches.current = []
      }

      if (event.touches.length === 2) {
        const distance = getTouchesDistance(touch1, touch2)
        const delta = distance / prevTouchesDistance.current

        const midpoint = getTouchesMidpoint(touch1, touch2)

        map2DViewRef.current.scaleAt(
          midpoint,
          delta,
          widthInTiles,
          heightInTiles
        )
        map2DViewRef.current.moveOffset(
          {
            x: midpoint.x - prevMidpoint.current.x,
            y: midpoint.y - prevMidpoint.current.y
          },
          widthInTiles,
          heightInTiles
        )

        prevMidpoint.current = midpoint
        prevTouchesDistance.current = distance
      }

      map2DViewRef.current.updateCenterHex()
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

      if (!map2DViewRef.current || !mapState.mapRef.current) {
        return
      }

      const {offsetX, offsetY, deltaY} = event
      // TODO: possible point to optimize - use limited length after dot scale value
      const delta = deltaY < 0 ? 1.1 : 1 / 1.1

      map2DViewRef.current.scaleAt(
        {x: offsetX, y: offsetY},
        delta,
        mapState.mapRef.current.widthInTiles,
        mapState.mapRef.current.heightInTiles
      )

      if (map2DViewRef.current.hoveredHex) {
        setHoveredHex({x: offsetX, y: offsetY})
      }

      map2DViewRef.current.updateCenterHex()
    }

    const onResize = () => {
      if (!map2DViewRef.current) {
        return
      }

      map2DViewRef.current.resize()
      map2DViewRef.current.hoveredHex = null
      map2DViewRef.current.updateCenterHex()
    }

    map2DViewRef.current.updateCenterHex()
    requestAnimationFrame(drawCanvas)

    wrapperRef.current!.addEventListener('mousemove', mouseEvent, {
      passive: true
    })
    wrapperRef.current!.addEventListener('mousedown', mouseEvent, {
      passive: true
    })
    wrapperRef.current!.addEventListener('mouseup', mouseEvent, {passive: true})
    wrapperRef.current!.addEventListener('mouseout', mouseEvent, {
      passive: true
    })
    wrapperRef.current!.addEventListener('touchstart', onTouchStart, {
      passive: false
    })
    wrapperRef.current!.addEventListener('touchmove', onTouchMove, {
      passive: false
    })
    wrapperRef.current!.addEventListener('touchend', onTouchEnd, {
      passive: false
    })
    wrapperRef.current!.addEventListener('wheel', mouseWheelEvent, {
      passive: false
    })
    window.addEventListener('resize', onResize, {passive: true})

    return () => {
      if (!map2DViewRef.current?.wrapperRef.current) {
        return
      }

      map2DViewRef.current.clearMap()

      wrapperRef.current!.removeEventListener('mousemove', mouseEvent)
      wrapperRef.current!.removeEventListener('mousedown', mouseEvent)
      wrapperRef.current!.removeEventListener('mouseup', mouseEvent)
      wrapperRef.current!.removeEventListener('mouseout', mouseEvent)
      wrapperRef.current!.removeEventListener('touchstart', onTouchStart)
      wrapperRef.current!.removeEventListener('touchmove', onTouchMove)
      wrapperRef.current!.removeEventListener('touchend', onTouchEnd)
      wrapperRef.current!.removeEventListener('wheel', mouseWheelEvent)
      window.removeEventListener('resize', onResize)
    }
  }, [mapState.isInitialized])
}
