import {styled} from '@mui/material/styles'
import {ButtonBase} from '@mui/material'

import {ImageButtonStylesProps, ImageSrcStylesProps} from './interfaces'

export const ImageButton = styled(ButtonBase)<ImageButtonStylesProps>(
  ({theme, isActive}) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: 64,
    width: 64,
    borderRadius: 16,
    border: isActive ? `2px solid ${theme.palette.primary.main}` : 'none',
    gap: '0 10px'
  })
)

export const ImageSrc = styled('span')<ImageSrcStylesProps>(({url}) => ({
  height: 56,
  width: 56,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundImage: `url(./assets/landscape/${url})`
}))
