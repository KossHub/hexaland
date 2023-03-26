import React, {useRef, useState, useEffect, useContext} from 'react'

import {CanvasContext} from '../../contexts/canvas'
import {useCanvasListeners} from '../../hooks/useCanvasListeners'
import {useSnackbar} from '../../hooks/useSnackbar'
import {CanvasContextState} from '../../contexts/canvas/interfaces'
import * as UI from './styles'

const Canvas = () => {
  const {enqueueSnackbar} = useSnackbar()
  const canvas = useContext(CanvasContext)

  const {addCanvasListeners, removeCanvasListeners} = useCanvasListeners(
    canvas as CanvasContextState
  )

  const canvasRef = useRef<null | HTMLCanvasElement>(null)

  const [isInitialized, setIsInitialized] = useState(false)

  /** Init canvas state */
  useEffect(() => {
    if (!canvasRef.current || !canvas) {
      return
    }

    if (canvas.ref === null) {
      canvas.ref = canvasRef.current
      canvas.ref.width = canvas.ref.offsetWidth
      canvas.ref.height = canvas.ref.offsetHeight
    }

    if (!canvas.ref?.getContext) {
      enqueueSnackbar('Браузер не поддерживается', {variant: 'error'})
      return
    }

    if (!canvas.ctx) {
      canvas.ctx = canvas.ref.getContext('2d')
      setIsInitialized(true)
    }
  }, [])

  useEffect(() => {
    if (!isInitialized || !canvas) {
      return
    }

    addCanvasListeners()

    return () => {
      removeCanvasListeners()
    }
  }, [isInitialized])

  return <UI.Canvas ref={canvasRef} />
}

export default Canvas
