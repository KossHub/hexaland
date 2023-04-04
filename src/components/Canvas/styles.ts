import {styled} from '@mui/material/styles'

export const Wrapper = styled('div')(({theme}) => ({
  background: theme.palette.common.white,
  flexGrow: 1,
  width: '100%',
  height: '100%',
  zIndex: 1,
  position: 'relative',

  '& > canvas': {
    height: '100%',
    width: '100%',
    position: 'absolute',
    imageRendering: 'pixelated',

    '&#canvasLandscape': {
      zIndex: 2
    },

    '&#canvasGrid': {
      zIndex: 3
    }
  },

  [theme.breakpoints.down('md')]: {
    height: `calc(100% - ${theme.spacing(7)})`
  }
}))
