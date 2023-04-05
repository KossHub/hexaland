import React, {useRef, useState, useEffect} from 'react'

import {
  CanvasContextState,
  CanvasRefs,
  CanvasContexts
} from '../../contexts/canvas/interfaces'
import {GameContextState} from '../../contexts/game/interfaces'
import {useCanvasContext} from '../../contexts/canvas/useCanvasContext'
import {useGameContext} from '../../contexts/game/useGameContext'
import {useCanvasListeners} from '../../hooks/useCanvasListeners'
import {useSnackbar} from '../../contexts/snackbar/useSnackbar'
import * as UI from './styles'
import {Game} from '../../core/classes/Game/Game'
import {RectMapInitData} from '../../core/interfaces/map.interfaces'

const Canvas = () => {
  const {enqueueSnackbar} = useSnackbar()
  const canvas = useCanvasContext()
  const gameState = useGameContext()

  const {addCanvasListeners, removeCanvasListeners} = useCanvasListeners(
    canvas as CanvasContextState,
    gameState as GameContextState
  )

  const wrapperRef = useRef<null | HTMLDivElement>(null)
  const canvasGridRef = useRef<null | HTMLCanvasElement>(null)
  const canvasLandscapeRef = useRef<null | HTMLCanvasElement>(null)

  const [isCanvasInitialized, setIsCanvasInitialized] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  /** Init canvas state */
  useEffect(() => {
    if (
      !canvas ||
      !canvasGridRef.current ||
      !canvasLandscapeRef.current ||
      !wrapperRef.current
    ) {
      return
    }

    if (!canvas.wrapperRef) {
      canvas.wrapperRef = wrapperRef.current
    }

    const width = canvas.wrapperRef?.clientWidth || 0
    const height = canvas.wrapperRef?.clientHeight || 0

    if (Object.values(canvas.refs).some((ref) => !ref)) {
      canvas.refs = {
        grid: canvasGridRef.current,
        landscape: canvasLandscapeRef.current
      }

      Object.keys(canvas.refs).forEach((key) => {
        canvas.refs[key as keyof CanvasRefs]!.width = width
        canvas.refs[key as keyof CanvasRefs]!.height = height
      })
    }

    if (!canvas.refs.grid?.getContext) {
      enqueueSnackbar('Браузер не поддерживается', {variant: 'error'})
      return
    }

    if (Object.values(canvas.contexts).some((ctx) => !ctx)) {
      Object.keys(canvas.contexts).forEach((key) => {
        canvas.contexts[key as keyof CanvasContexts] = canvas.refs[
          key as keyof CanvasRefs
        ]!.getContext('2d', {
          alpha: key !== 'landscape' // only the bottom layer isn't transparent
        })
      })

      setIsCanvasInitialized(true)
    }
  }, [])

  useEffect(() => {
    if (!isCanvasInitialized) {
      return
    }

    gameState.game = new Game(
        'dev_game',
      {top: 0, bottom: 9, left: 0, right: 9},
      [],
      () => setIsLoading(false)
    )
  }, [isCanvasInitialized])

  useEffect(() => {
    if (!isCanvasInitialized || isLoading) {
      return
    }

    addCanvasListeners()

    return () => {
      removeCanvasListeners()
    }
  }, [isCanvasInitialized, isLoading])

  return (
    <UI.Wrapper ref={wrapperRef}>
      <canvas ref={canvasGridRef} id="canvasGrid" />
      <canvas ref={canvasLandscapeRef} id="canvasLandscape" />
    </UI.Wrapper>
  )
}

export default Canvas
