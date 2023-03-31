import {styled} from '@mui/material/styles'

export const Wrapper = styled('canvas')(({theme}) => ({
  background: theme.palette.common.white,
  flexGrow: 1,
  width: '100%',
  height: '100%'
}))
