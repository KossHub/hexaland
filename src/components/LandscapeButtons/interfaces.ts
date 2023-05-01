import {PropsWithChildren} from 'react'

import {LANDSCAPES} from '../../core/classes/LandscapeTemplates/constants'

export interface LandscapeButtonsProps extends PropsWithChildren {
  onSelect: (type: keyof typeof LANDSCAPES) => void
  active: null | string
}

export interface ImageSrcStylesProps {
  url: string
}
