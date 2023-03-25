import React from 'react'
import {ButtonProps} from '@mui/material'

import * as UI from './styles'

const Button: React.FC<ButtonProps> = (props) => {
  const {children, ...restProps} = props

  return <UI.Button {...restProps}>{children}</UI.Button>
}

export default Button
