import React, {useRef, useState, useEffect} from 'react'

import {CanvasContextState} from '../../contexts/canvas/interfaces'
import {GameMapContextState} from '../../contexts/gameMap/interfaces'
import {RectMap} from '../../core/classes/GameMap/RectMap'
import {useCanvasContext} from '../../contexts/canvas/useCanvasContext'
import {useGameMapContext} from '../../contexts/gameMap/useGameMapContext'
import {useCanvasListeners} from '../../hooks/useCanvasListeners'
import {useSnackbar} from '../../contexts/snackbar/useSnackbar'
import * as UI from './styles'

const Canvas = () => {
  const {enqueueSnackbar} = useSnackbar()
  const canvas = useCanvasContext()
  const gameMapState = useGameMapContext()

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
      // @ts-ignore
      window.C = canvas.ref
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
      right: 100,
      bottom: 100,
      left: 0
    })

    addCanvasListeners()

    return () => {
      removeCanvasListeners()
    }
  }, [isInitialized])

  return (
    <UI.Wrapper>
      <canvas ref={canvasRef} />
    </UI.Wrapper>
  )
}

export default Canvas
