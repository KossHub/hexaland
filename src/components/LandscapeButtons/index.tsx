import React from 'react'

import * as UI from './styles'
import {LandscapeButtonsProps} from './interfaces'
import {LANDSCAPE_TYPES} from '../../core/classes/LandscapeTemplates/constants'
import Tooltip from '../Tooltip'

const LandscapeButtons: React.FC<LandscapeButtonsProps> = (props) => {
  const {onSelect} = props

  return (
    <>
      {Object.keys(LANDSCAPE_TYPES).map((type) => (
        <Tooltip key={type} title={type}>
          <UI.ImageButton onClick={() => onSelect(type)}>
            <UI.ImageSrc url={LANDSCAPE_TYPES[type].detailed as string} />
          </UI.ImageButton>
        </Tooltip>
      ))}
    </>
  )
}

export default LandscapeButtons
