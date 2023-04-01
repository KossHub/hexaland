import {useContext} from 'react'

import {CanvasContextState} from './interfaces'
import {CanvasContext} from './index'

export const useCanvasContext = () => {
  const context = useContext(CanvasContext)

  if (context === undefined) {
    throw new Error('useCanvasContext was used outside of its Provider')
  }

  return context as CanvasContextState
}
