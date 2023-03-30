import {styled} from '@mui/material/styles'
import {Container} from '@mui/material'

export const PageContainer = styled(Container)(({theme}) => ({
  position: 'relative',
  height: '100vh',

  '&.MuiContainer-root': {
    padding: 0
  },

  [theme.breakpoints.down('md')]: {
    '&.MuiContainer-root': {
      paddingBottom: theme.spacing(7)
    }
  }
}))
