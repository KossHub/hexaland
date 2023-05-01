import React from 'react'

import Tooltip from '../Tooltip'
import {LandscapeButtonsProps} from './interfaces'
import {LANDSCAPES} from '../../core/classes/LandscapeTemplates/constants'
import * as UI from './styles'

const LandscapeButtons: React.FC<LandscapeButtonsProps> = (props) => {
  const {active, onSelect} = props

  return (
    <>
      {Object.keys(LANDSCAPES).map((landscapeType) => (
        <Tooltip key={landscapeType} title={landscapeType}>
          <UI.ImageButton disableRipple onClick={() => onSelect(landscapeType)}>
            <UI.ImageSrc url={LANDSCAPES[landscapeType].imageName} />
            {active === landscapeType && <UI.Icon />}
          </UI.ImageButton>
        </Tooltip>
      ))}
    </>
  )
}

export default LandscapeButtons
