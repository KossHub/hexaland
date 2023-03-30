import React, {useRef, useState, useEffect, useContext} from 'react'

import {CanvasContext} from '../../contexts/canvas'
import {GameMapContext} from '../../contexts/gameMap'
import {useCanvasListeners} from '../../hooks/useCanvasListeners'
import {useSnackbar} from '../../hooks/useSnackbar'
import {CanvasContextState} from '../../contexts/canvas/interfaces'
import {GameMapContextState} from '../../contexts/gameMap/interfaces'
import {RectMap} from '../../core/classes/RectMap'
import * as UI from './styles'

const Canvas = () => {
  const {enqueueSnackbar} = useSnackbar()
  const canvas = useContext(CanvasContext)
  const gameMapState = useContext(GameMapContext)

  const {addCanvasListeners, removeCanvasListeners} = useCanvasListeners(
    canvas as CanvasContextState,
    gameMapState as GameMapContextState
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

    gameMapState!.gameMap = new RectMap({
      top: 0,
      right: 36,
      bottom: 36,
      left: 0
    })

    addCanvasListeners()

    return () => {
      removeCanvasListeners()
    }
  }, [isInitialized])

  return <UI.Canvas ref={canvasRef} />
}

export default Canvas
