import React, {createContext, useRef, PropsWithChildren} from 'react'

import {CanvasContextState} from './interfaces'
import {SCALE, ZERO_AXIAL_COORDS, ZERO_SHORT_CUBE_COORDS} from '../../constants'

export const CanvasContext = createContext<null | CanvasContextState>(null)

const CanvasProvider: React.FC<PropsWithChildren> = (props) => {
  const {children} = props

  const wrapperRef = useRef<CanvasContextState['wrapperRef']>(null)
  const canvasesRef = useRef<CanvasContextState['refs']>({
    grid: null,
    landscape: null
  })
  const contextsRef = useRef<CanvasContextState['contexts']>({
    grid: null,
    landscape: null
  })
  const scale = useRef<CanvasContextState['scale']>(SCALE.INIT)
  const originOffset =
    useRef<CanvasContextState['originOffset']>(ZERO_AXIAL_COORDS)

  const contextValue: CanvasContextState = {
    wrapperRef: wrapperRef.current,
    refs: canvasesRef.current,
    contexts: contextsRef.current,
    scale: scale.current,
    originOffset: originOffset.current
  }

  return (
    <CanvasContext.Provider value={contextValue}>
      {children}
    </CanvasContext.Provider>
  )
}

export default CanvasProvider
