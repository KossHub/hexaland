import React, {useContext, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {signInWithEmailAndPassword} from 'firebase/auth'
import {Link} from '@mui/material'

import AuthFormWrapper from '../../components/AuthFormWrapper'
import TextField from '../../components/TextField'
import Button from '../../components/Button'
import LoadingButton from '../../components/LoadingButton'
import {useAuthContext} from '../../contexts/auth/useAuthContext'
import {useSnackbar} from '../../contexts/snackbar/useSnackbar'
import {hasFormEmptyField} from '../../utils/authHelpers'
import {INIT_FORM_STATE} from './constants'

const LoginPage = () => {
  const navigate = useNavigate()
  const {enqueueSnackbar, closeSnackbar} = useSnackbar()
  const {auth} = useAuthContext()

  const [isLoading, setIsLoading] = useState(false)
  const [form, setForm] = useState(INIT_FORM_STATE)

  const resetForm = () => {
    setForm(INIT_FORM_STATE)
  }

  const handleLogin = async () => {
    setIsLoading(true)
    signInWithEmailAndPassword(auth, form.email, form.password)
      .then(() => {
        navigate('/')
        closeSnackbar()
        enqueueSnackbar('Вы успешно вошли', {variant: 'success'})
      })
      .catch(() => {
        resetForm()
        enqueueSnackbar('Не удалось войти', {
          variant: 'error',
          onlyBottom: true
        })
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  const goToSignupPage = () => {
    navigate('/signup')
  }

  const goToForgotPasswordPage = () => {
    navigate('/forgot-password')
  }

  const goToHomeGuest = () => {
    navigate('/welcome')
    enqueueSnackbar(
      <>
        Вы вошли на страницу как гость
        <br />
        Зарегистрируйте аккаунт
      </>,
      {
        variant: 'info',
        onlyBottom: true
      }
    )
  }

  const handleChangeField = (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({
      ...prev,
      [event.target.name]: event.target.value
    }))
  }

  return (
    <AuthFormWrapper title="Авторизация" onSubmit={handleLogin}>
      <TextField
        autoFocus
        required
        label="Адрес электронной почты"
        name="email"
        onChange={handleChangeField}
        value={form.email}
        disabled={isLoading}
      />
      <TextField
        required
        label="Пароль"
        name="password"
        onChange={handleChangeField}
        value={form.password}
        type="password"
        disabled={isLoading}
      />
      <LoadingButton
        type="submit"
        loading={isLoading}
        disabled={hasFormEmptyField(form)}
      >
        Войти
      </LoadingButton>
      <Button onClick={goToHomeGuest} disabled={isLoading}>
        Войти как гость
      </Button>
      <Link
        component="button"
        variant="body2"
        onClick={goToSignupPage}
        disabled={isLoading}
      >
        Еще нет аккаунта? Зарегистрироваться
      </Link>
      <Link
        component="button"
        variant="body2"
        onClick={goToForgotPasswordPage}
        disabled={isLoading}
      >
        Восстановить пароль
      </Link>
    </AuthFormWrapper>
  )
}

export default LoginPage
