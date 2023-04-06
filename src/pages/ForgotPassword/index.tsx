import React, {useContext, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {sendPasswordResetEmail} from 'firebase/auth'
import {Link} from '@mui/material'

import AuthFormWrapper from '../../components/AuthFormWrapper'
import TextField from '../../components/TextField'
import LoadingButton from '../../components/LoadingButton'
import {useAuthContext} from '../../contexts/auth/useAuthContext'
import {useSnackbar} from '../../contexts/snackbar/useSnackbar'

const ForgotPassword = () => {
  const navigate = useNavigate()
  const {enqueueSnackbar} = useSnackbar()
  const {auth} = useAuthContext()

  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')

  const handleResetPassword = async () => {
    setIsLoading(true)
    sendPasswordResetEmail(auth, email, {
      url: 'https://hexaland-e91a6.web.app/login'
    }).finally(() => {
      navigate('/login', {replace: true})
      enqueueSnackbar(
        'Письмо со ссылкой для восстановления пароля успешно отправлено',
        {variant: 'success', onlyBottom: true}
      )
    })
  }

  const goToLoginPage = () => {
    navigate('/login', {replace: true})
  }

  const handleChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value.trim())
  }

  return (
    <AuthFormWrapper
      title="Восстановление пароля"
      onSubmit={handleResetPassword}
    >
      <TextField
        autoFocus
        required
        label="Адрес электронной почты"
        name="email"
        onChange={handleChangeEmail}
        value={email}
        disabled={isLoading}
      />
      <LoadingButton
        type="submit"
        loading={isLoading}
        disabled={isLoading || !email.trim()}
      >
        Отправить
      </LoadingButton>
      <Link
        component="button"
        variant="body2"
        onClick={goToLoginPage}
        disabled={isLoading}
      >
        Вернуться к авторизации
      </Link>
    </AuthFormWrapper>
  )
}

export default ForgotPassword
