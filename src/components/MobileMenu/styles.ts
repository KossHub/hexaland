import {styled} from '@mui/material/styles'
import {Paper} from '@mui/material'

export const Wrapper = styled(Paper)(({theme}) => ({
  display: 'none',

  [theme.breakpoints.down('md')]: {
    display: 'block',
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0
  }
}))
