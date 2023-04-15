import React from 'react'

import {RectMap} from '../../core/classes/GameMap/RectMap'
import {ShortCubeCoords} from '../canvas/interfaces'

export interface MapContextState {
  isInitialized: boolean
  setIsInitialized: React.Dispatch<React.SetStateAction<boolean>>
  mapRef: React.MutableRefObject<null | RectMap>
}
