import {styled} from '@mui/material/styles'
import {ButtonBase} from '@mui/material'
import {ImageSrcStylesProps} from './interfaces'

export const ImageButton = styled(ButtonBase)(({theme}) => ({
  height: 48,
  width: 48,
  borderRadius: 8
}))

export const ImageSrc = styled('span')<ImageSrcStylesProps>(({url}) => ({
  position: 'absolute',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundImage: `url(./assets/landscape/${url})`,
}))
