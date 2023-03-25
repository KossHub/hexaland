import {styled} from '@mui/material/styles'
import {Dialog as MuiDialog, AppBar as MuiAppBar} from '@mui/material'

export const Dialog = styled(MuiDialog)(({theme}) => ({
  '& .MuiDialog-paper': {
    background: theme.palette.common.white
  }
}))

export const AppBar = styled(MuiAppBar)(({theme}) => ({
  position: 'relative',
  paddingLeft: theme.spacing(1.5)
}))
