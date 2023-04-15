import React from 'react'

import Tooltip from '../Tooltip'
import {LandscapeButtonsProps} from './interfaces'
import {LANDSCAPE_TYPES} from '../../core/classes/LandscapeTemplates/constants'
import * as UI from './styles'

const LandscapeButtons: React.FC<LandscapeButtonsProps> = (props) => {
  const {active, onSelect} = props

  return (
    <>
      {Object.keys(LANDSCAPE_TYPES).map((type) => (
        <Tooltip key={type} title={type}>
          <UI.ImageButton disableRipple onClick={() => onSelect(type)}>
            <UI.ImageSrc url={LANDSCAPE_TYPES[type].detailed as string} />
            {active === type && <UI.Icon />}
          </UI.ImageButton>
        </Tooltip>
      ))}
    </>
  )
}

export default LandscapeButtons
