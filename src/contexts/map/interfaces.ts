import React from 'react'

import {RectMap} from '../../core/classes/GameMap/RectMap'
import {ShortCubeCoords} from '../canvas/interfaces'

export interface MapContextState {
  selectedHex: null | ShortCubeCoords
  hoveredHex: null | ShortCubeCoords
  isInitialized: boolean
  setSelectedHex: React.Dispatch<React.SetStateAction<null | ShortCubeCoords>>
  setHoveredHex: React.Dispatch<React.SetStateAction<null | ShortCubeCoords>>
  setIsInitialized: React.Dispatch<React.SetStateAction<boolean>>
  mapRef: React.MutableRefObject<null | RectMap>
}
