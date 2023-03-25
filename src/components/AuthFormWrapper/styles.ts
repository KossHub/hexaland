import {styled} from '@mui/material/styles'
import {Container as MuiContainer} from '@mui/material'

import {fadeIn} from '../../styles/animations'

export const Container = styled(MuiContainer)(({theme}) => ({
  display: 'flex !important',
  flexDirection: 'column',
  alignItems: 'center',
  marginTop: theme.spacing(8),
  marginBottom: theme.spacing(8),
  gap: theme.spacing(4),
  animation: `${fadeIn} 1s`,

  [theme.breakpoints.down('sm')]: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
    gap: theme.spacing(3)
  }
}))
