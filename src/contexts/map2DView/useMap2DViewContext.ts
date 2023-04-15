import {useContext} from 'react'

import {Map2DViewContextState} from './interfaces'
import {Map2DViewContext} from './index'

export const useMap2DViewContext = () => {
  const context = useContext(Map2DViewContext)

  if (context === undefined) {
    throw new Error('useMap2DViewContext was used outside of its Provider')
  }

  return context as Map2DViewContextState
}
