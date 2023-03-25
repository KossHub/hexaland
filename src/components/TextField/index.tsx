import React from 'react'
import {TextFieldProps} from '@mui/material'

import * as UI from './styles'

const TextField: React.FC<TextFieldProps> = (props) => (
  <UI.TextField variant="outlined" {...props} />
)

export default TextField
