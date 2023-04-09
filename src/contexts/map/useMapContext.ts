import {useContext} from 'react'

import {MapContextState} from './interfaces'
import {MapContext} from './index'

export const useMapContext = () => {
  const context = useContext(MapContext)

  if (context === undefined) {
    throw new Error('useMapContext was used outside of its Provider')
  }

  return context as MapContextState
}
