import React, {useRef, useEffect, useContext} from 'react'

import {CanvasContext} from '../../contexts/canvas'
import {useCanvasZoom} from '../../hooks/useCanvasZoom'
import {CanvasObj} from '../../interfaces'
import {useSnackbar} from '../../hooks/useSnackbar'
import {clearMap, drawHex} from '../../core/utils/map.utils'
import {useCursorPosition} from '../../hooks/useCursorPosition'
import * as UI from './styles'

const Canvas = () => {
  const {enqueueSnackbar} = useSnackbar()
  const canvas = useContext(CanvasContext)
  const {addZoomListener, removeZoomListener} = useCanvasZoom(
    canvas as CanvasObj
  )
  const {addMousemoveListener, removeMousemoveListener} = useCursorPosition(
    canvas as CanvasObj
  )

  const canvasRef = useRef<null | HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) {
      return
    }

    if (!canvas.ref) {
      canvas.ref = canvasRef.current
      canvas.ref.width = canvas.ref.offsetWidth
      canvas.ref.height = canvas.ref.offsetHeight
    }

    if (!canvas.ref.getContext) {
      enqueueSnackbar('Браузер не поддерживается', {variant: 'error'})
      return
    }

    if (!canvas.ctx) {
      canvas.ctx = canvas.ref.getContext('2d')
    }
  }, [])

  useEffect(() => {
    addZoomListener()
    addMousemoveListener()

    return () => {
      removeZoomListener()
      removeMousemoveListener()
    }
  }, [])

  useEffect(() => {
    clearMap(canvas as CanvasObj)
    requestAnimationFrame(() => {
      drawHex(canvas.ctx as CanvasRenderingContext2D, {
        coords: {x: 200, y: 200}
      })
    })
  }, [])

  return <UI.Canvas ref={canvasRef} />
}

export default Canvas
