import {styled} from '@mui/material/styles'
import {Typography} from '@mui/material'

import {FieldValueStylesProps} from './interfaces'

export const FieldName = styled(Typography)()
FieldName.defaultProps = {
  color: 'primary',
  variant: 'body2',
  mr: 2
}

export const FieldValue = styled(Typography)<FieldValueStylesProps>(
  ({color}) => ({
    color
  })
)
FieldValue.defaultProps = {
  variant: 'body1'
}

export const ButtonsWrapper = styled('div')(({theme}) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2)
}))
