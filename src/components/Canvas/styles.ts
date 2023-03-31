import {styled} from '@mui/material/styles'

export const Wrapper = styled('div')(({theme}) => ({theme}) => ({
  background: theme.palette.common.white,
  flexGrow: 1,
  width: '100%',
  height: '100%',

  '& > canvas': {
    height: '100%',
    width: '100%'
  },

  [theme.breakpoints.down('md')]: {
    height: `calc(100% - ${theme.spacing(7)})`
  }
}))
