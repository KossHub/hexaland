import React, {createContext, useRef, PropsWithChildren} from 'react'

import {CanvasContextState} from './interfaces'

export const CanvasContext = createContext<CanvasContextState>({
  ref: null,
  ctx: null,
  cursorPos: {x: 0, y: 0}
})

const CanvasProvider: React.FC<PropsWithChildren> = (props) => {
  const {children} = props

  const canvasRef = useRef<CanvasContextState['ref']>(null)
  const ctxRef = useRef<CanvasContextState['ctx']>(null)
  const cursorPos = useRef<CanvasContextState['cursorPos']>({x: 0, y: 0})

  const contextValue: CanvasContextState = {
    ref: canvasRef.current,
    ctx: ctxRef.current,
    cursorPos: cursorPos.current
  }

  return (
    <CanvasContext.Provider value={contextValue}>
      {children}
    </CanvasContext.Provider>
  )
}

export default CanvasProvider
