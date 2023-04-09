import React, {createContext, useRef, PropsWithChildren} from 'react'

import {MapContextState} from './interfaces'

export const MapContext = createContext<null | MapContextState>(null)

const MapProvider: React.FC<PropsWithChildren> = (props) => {
  const {children} = props

  const gameRef = useRef<MapContextState['map']>(null)

  const contextValue: MapContextState = {
    map: gameRef.current
  }

  return (
    <MapContext.Provider value={contextValue}>{children}</MapContext.Provider>
  )
}

export default MapProvider
