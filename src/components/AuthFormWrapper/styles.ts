import {styled} from '@mui/material/styles'
import {Container as MuiContainer} from '@mui/material'

import {fadeIn} from '../../styles/animations'

export const Container = styled(MuiContainer)(({theme}) => ({
  marginTop: theme.spacing(8),
  marginBottom: theme.spacing(8),

  animation: `${fadeIn} 1s`,

  '& form': {
    display: 'flex !important',
    flexDirection: 'column',
    alignItems: 'center',
    gap: theme.spacing(4)
  },

  [theme.breakpoints.down('sm')]: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),

    '& form': {
      gap: theme.spacing(2)
    }
  }
}))
