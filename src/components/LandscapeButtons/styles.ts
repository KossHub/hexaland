import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import {styled} from '@mui/material/styles'
import {ButtonBase} from '@mui/material'

import {ImageSrcStylesProps} from './interfaces'

export const ImageButton = styled(ButtonBase)(({theme}) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: 64,
  width: 64,
  borderRadius: 16
}))

export const ImageSrc = styled('span')<ImageSrcStylesProps>(({url}) => ({
  height: 56,
  width: 56,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundImage: `url(./assets/landscape/${url})`
}))
export const Icon = styled(CheckCircleRoundedIcon)(({theme}) => ({
  position: 'absolute',
  color: theme.palette.common.white,
  bottom: 8,
}))
