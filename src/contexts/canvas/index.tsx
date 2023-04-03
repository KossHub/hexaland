import React, {createContext, useRef, PropsWithChildren} from 'react'

import {CanvasContextState} from './interfaces'
import {SCALE, ZERO_AXIAL_COORDS} from '../../constants'

export const CanvasContext = createContext<null | CanvasContextState>(null)

const CanvasProvider: React.FC<PropsWithChildren> = (props) => {
  const {children} = props

  const canvasRef = useRef<CanvasContextState['ref']>(null)
  const ctxRef = useRef<CanvasContextState['ctx']>(null)
  const scale = useRef<CanvasContextState['scale']>(SCALE.INIT)
  const originOffset =
    useRef<CanvasContextState['originOffset']>(ZERO_AXIAL_COORDS)

  const contextValue: CanvasContextState = {
    ref: canvasRef.current,
    ctx: ctxRef.current,
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
