import React from 'react'
import {Typography} from '@mui/material'

import {AuthFormWrapperPros} from './interfaces'
import * as UI from './styles'

const AuthFormWrapper: React.FC<AuthFormWrapperPros> = (props) => {
  const {title, children} = props

  return (
    <UI.Container maxWidth="sm">
      <Typography variant="h3" color="primary">
        {title}
      </Typography>

      {children}
    </UI.Container>
  )
}

export default AuthFormWrapper
