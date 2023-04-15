import React, {createContext, PropsWithChildren, useRef} from 'react'

import {Map2DViewContextState} from './interfaces'
import {Map2DView} from '../../core/classes/Map2DView'

export const Map2DViewContext =
  createContext<null | Map2DViewContextState>(null)

const Map2DViewProvider: React.FC<PropsWithChildren> = (props) => {
  const {children} = props

  const map2DViewRef = useRef<null | Map2DView>(null)

  return (
    <Map2DViewContext.Provider value={map2DViewRef}>
      {children}
    </Map2DViewContext.Provider>
  )
}

export default Map2DViewProvider
