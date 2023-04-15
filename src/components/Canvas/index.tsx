import React, {useRef, useEffect, MutableRefObject} from 'react'

import {Map2DView} from '../../core/classes/Map2DView'
import {useMapContext} from '../../contexts/map/useMapContext'
import {useMap2DViewContext} from '../../contexts/map2DView/useMap2DViewContext'
import {useCanvasListeners} from '../../hooks/useCanvasListeners'
import {useSnackbar} from '../../contexts/snackbar/useSnackbar'
import * as UI from './styles'

const Canvas = () => {
  const {enqueueSnackbar} = useSnackbar()
  const map2DViewRef = useMap2DViewContext()
  const mapState = useMapContext()

  useCanvasListeners(map2DViewRef, mapState)

  const wrapperRef = useRef<null | HTMLDivElement>(null)
  const canvasGridRef = useRef<null | HTMLCanvasElement>(null)
  const canvasLandscapeRef = useRef<null | HTMLCanvasElement>(null)

  useEffect(() => {
    if (
      !canvasGridRef.current ||
      !canvasLandscapeRef.current ||
      !wrapperRef.current
    ) {
      return
    }

    map2DViewRef.current = new Map2DView(
      canvasGridRef as MutableRefObject<HTMLCanvasElement>,
      canvasLandscapeRef as MutableRefObject<HTMLCanvasElement>,
      wrapperRef as MutableRefObject<HTMLDivElement>,
      32,
      () => {
        enqueueSnackbar('Браузер не поддерживается', {variant: 'error'})
      }
    )
  }, [])

  return (
    <UI.Wrapper square ref={wrapperRef} elevation={2}>
      <canvas ref={canvasGridRef} id="canvasGrid" />
      <canvas ref={canvasLandscapeRef} id="canvasLandscape" />
    </UI.Wrapper>
  )
}

export default Canvas
