import {PropsWithChildren} from 'react'

import {LANDSCAPE_TYPES} from '../../core/classes/LandscapeTemplates/constants'

export interface LandscapeButtonsProps extends PropsWithChildren {
  onSelect: (type: keyof typeof LANDSCAPE_TYPES) => void
  active: null | string
}

export interface ImageSrcStylesProps {
  url: string
}
