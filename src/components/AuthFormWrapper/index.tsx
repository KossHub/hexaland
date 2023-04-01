import React from 'react'
import {Typography} from '@mui/material'

import {AuthFormWrapperPros} from './interfaces'
import * as UI from './styles'

const AuthFormWrapper: React.FC<AuthFormWrapperPros> = (props) => {
  const {title, onSubmit, children} = props

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSubmit()
  }

  return (
    <UI.Container maxWidth="sm">
      <Typography variant="h4" color="primary" mb={4} textAlign="center">
        {title}
      </Typography>

      <form onSubmit={handleSubmit}>{children}</form>
    </UI.Container>
  )
}

export default AuthFormWrapper
