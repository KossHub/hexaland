import React, {createContext, useRef, PropsWithChildren, useState} from 'react'

import {MapContextState} from './interfaces'
import {RectMap} from "../../core/classes/GameMap/RectMap";

export const MapContext = createContext<null | MapContextState>(null)

const MapProvider: React.FC<PropsWithChildren> = (props) => {
  const {children} = props

  const [selectedHex, setSelectedHex] =
    useState<MapContextState['selectedHex']>(null)
  const [hoveredHex, setHoveredHex] =
    useState<MapContextState['hoveredHex']>(null)

  const mapRef = useRef<null | RectMap>(null)

  const contextValue: MapContextState = {
    selectedHex,
    hoveredHex,
    setSelectedHex,
    setHoveredHex,
    map: mapRef
  }

  return (
    <MapContext.Provider value={contextValue}>{children}</MapContext.Provider>
  )
}

export default MapProvider
