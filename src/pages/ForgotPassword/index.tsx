import React, {useContext, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {sendPasswordResetEmail} from 'firebase/auth'
import {Link} from '@mui/material'

import AuthFormWrapper from '../../components/AuthFormWrapper'
import TextField from '../../components/TextField'
import LoadingButton from '../../components/LoadingButton'
import {AuthContext} from '../../contexts/auth'
import {useSnackbar} from '../../hooks/useSnackbar'

const ForgotPassword = () => {
  const navigate = useNavigate()
  const {enqueueSnackbar} = useSnackbar()
  const {auth} = useContext(AuthContext)

  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')

  const handleResetPassword = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault()
    setIsLoading(true)
    sendPasswordResetEmail(auth, email, {
      url: 'https://hexaland-e91a6.web.app/login'
    }).finally(() => {
      navigate('/login')
      enqueueSnackbar(
        'Письмо со ссылкой для восстановления пароля успешно отправлено',
        {variant: 'success', onlyBottom: true}
      )
    })
  }

  const goToLoginPage = () => {
    navigate('/login')
  }

  const handleChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value)
  }

  return (
    <AuthFormWrapper title="Восстановление пароля">
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
        onClick={handleResetPassword}
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
