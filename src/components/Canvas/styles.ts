import {styled} from '@mui/material/styles'
import {Paper} from "@mui/material";

export const Wrapper = styled(Paper)(({theme}) => ({
  position: 'relative',
  flexGrow: 1,
  left: 0,
  right: 0,
  margin: '0 auto',
  maxWidth: '1200px',
  width: '100%',
  height: '100%',
  zIndex: 1,

  '& > canvas': {
    height: '100%',
    width: '100%',
    position: 'absolute',
    // imageRendering: 'pixelated', '// FIXME: to use or not to use

    '&#canvasLandscape': {
      zIndex: 2
    },

    '&#canvasGrid': {
      zIndex: 3
    }
  },

  [theme.breakpoints.down('md')]: {
    margin: 0,
    height: `calc(100% - ${theme.spacing(7)})`
  }
}))
