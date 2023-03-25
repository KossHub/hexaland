import {styled} from '@mui/material/styles'
import {Container} from '@mui/material'

export const PageContainer = styled(Container)(({theme}) => ({
  position: 'relative',
  height: '100vh',

  '&.MuiContainer-root': {
    padding: 0
  },

  [theme.breakpoints.down('md')]: {
    top: 0,
    height: `calc(100vh - ${theme.spacing(7)})`
  }
}))
