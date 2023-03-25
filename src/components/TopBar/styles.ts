import {styled} from '@mui/material/styles'
import {Slide, IconButton} from '@mui/material'

export const NavbarWrapper = styled(Slide)(({theme}) => ({
  [theme.breakpoints.down('md')]: {
    display: 'none'
  }
}))

export const ShowMenuButton = styled(IconButton)(({theme}) => ({
  position: 'absolute',
  top: theme.spacing(1.5),
  left: theme.spacing(3),
  zIndex: 1,

  [theme.breakpoints.down('md')]: {
    display: 'none'
  }
}))
