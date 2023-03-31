import {styled} from '@mui/material/styles'
import {Container} from '@mui/material'

export const PageContainer = styled(Container)({
  position: 'relative',
  height: '100%',

  '&.MuiContainer-root': {
    display: 'flex',
    flexDirection: 'column',
    padding: 0
  }
})
