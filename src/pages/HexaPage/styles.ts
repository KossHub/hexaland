import {styled} from '@mui/material/styles'
import {Container} from '@mui/material'

export const PageContainer = styled(Container)`
  position: relative;
  height: 100vh;

  &.MuiContainer-root {
    padding: 0;
  }

  ${({theme}) => theme.breakpoints.down('md')} {
    top: 0;
    height: calc(100vh - ${({theme}) => theme.spacing(7)});
    height: -moz-calc(100vh - ${({theme}) => theme.spacing(7)});
    height: -o-calc(100vh - ${({theme}) => theme.spacing(7)});
    height: -webkit-calc(100vh - ${({theme}) => theme.spacing(7)});
  }
`
