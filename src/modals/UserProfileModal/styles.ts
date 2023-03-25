import {Avatar as MuiAvatar, Container} from '@mui/material'
import {styled} from '@mui/material/styles'

export const ContentWrapper = styled(Container)(({theme}) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),

  [theme.breakpoints.down('sm')]: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2)
  }
}))
ContentWrapper.defaultProps = {
  maxWidth: 'sm'
}

export const Inner = styled('div')(({theme}) => ({
  display: 'flex',
  gap: theme.spacing(6),

  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: theme.spacing(3)
  }
}))

export const UserDataWrapper = styled('div')(({theme}) => ({
  display: 'flex',
  flexDirection: 'column',
  flexGrow: 1,
  width: '100%',
  gap: theme.spacing(3)
}))

export const Avatar = styled(MuiAvatar)(({theme}) => ({
  width: theme.spacing(12),
  height: theme.spacing(12)
}))
