import React, {createContext, useRef, PropsWithChildren, useState} from 'react'

import {MapContextState} from './interfaces'
import {RectMap} from '../../core/classes/GameMap/RectMap'

export const MapContext = createContext<null | MapContextState>(null)

const MapProvider: React.FC<PropsWithChildren> = (props) => {
  const {children} = props

  const [isInitialized, setIsInitialized] = useState(false)

  const mapRef = useRef<null | RectMap>(null)

  const contextValue: MapContextState = {
    isInitialized,
    setIsInitialized,
    mapRef
  }

  return (
    <MapContext.Provider value={contextValue}>{children}</MapContext.Provider>
  )
}

export default MapProvider
