import React, {useRef, useState, useEffect} from 'react'

import {CanvasRefs, CanvasContexts} from '../../contexts/canvas/interfaces'
import {useCanvasContext} from '../../contexts/canvas/useCanvasContext'
import {useMapContext} from '../../contexts/map/useMapContext'
import {useCanvasListeners} from '../../hooks/useCanvasListeners'
import {useSnackbar} from '../../contexts/snackbar/useSnackbar'
import * as UI from './styles'

const Canvas = () => {
  const {enqueueSnackbar} = useSnackbar()
  const canvas = useCanvasContext()
  const mapState = useMapContext()

  useCanvasListeners(canvas, mapState)

  const wrapperRef = useRef<null | HTMLDivElement>(null)
  const canvasGridRef = useRef<null | HTMLCanvasElement>(null)
  const canvasLandscapeRef = useRef<null | HTMLCanvasElement>(null)

  const [isCanvasInitialized, setIsCanvasInitialized] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

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

    const width = canvas.wrapperRef.clientWidth
    const height = canvas.wrapperRef.clientHeight

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
        const context = canvas.refs[key as keyof CanvasRefs]!.getContext(
          '2d'
        ) as CanvasRenderingContext2D

        canvas.contexts[key as keyof CanvasContexts] = context
      })

      setIsCanvasInitialized(true)
    }
  }, [])

  // useEffect(() => {
  //   if (!isCanvasInitialized) {
  //     return
  //   }
  //
  //   mapState.map = new RectMap({
  //     top: 0,
  //     bottom: 99,
  //     left: 0,
  //     right: 99
  //   })
  //
  //   setIsLoading(false)
  // }, [isCanvasInitialized])

  // useEffect(() => {
  //   if (!isCanvasInitialized || isLoading) {
  //     return
  //   }
  //
  //   addCanvasListeners()
  //
  //   return () => {
  //     removeCanvasListeners()
  //   }
  // }, [isCanvasInitialized, isLoading])

  return (
    <UI.Wrapper square ref={wrapperRef} elevation={2}>
      <canvas ref={canvasGridRef} id="canvasGrid" />
      <canvas ref={canvasLandscapeRef} id="canvasLandscape" />
    </UI.Wrapper>
  )
}

export default Canvas
