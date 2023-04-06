import {styled} from '@mui/material/styles'
import {Paper} from '@mui/material'

export const Wrapper = styled(Paper)(({theme}) => ({
  display: 'none',
  overflowX: 'auto',
  paddingTop: '100vh',
  marginTop: '-100vh',

  [theme.breakpoints.down('md')]: {
    display: 'block'
  }
}))
