import React from 'react'

import {RectMap} from '../../core/classes/GameMap/RectMap'
import {ShortCubeCoords} from "../canvas/interfaces";

export interface MapContextState {
  map: null | RectMap
  selectedHex: null | ShortCubeCoords
  hoveredHex: null | ShortCubeCoords
  setSelectedHex: React.Dispatch<React.SetStateAction<null | ShortCubeCoords>>
  setHoveredHex: React.Dispatch<React.SetStateAction<null | ShortCubeCoords>>
}
