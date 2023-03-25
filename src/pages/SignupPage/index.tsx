import React, {useContext, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {Link} from '@mui/material'
import {createUserWithEmailAndPassword} from 'firebase/auth'

import AuthFormWrapper from '../../components/AuthFormWrapper'
import TextField from '../../components/TextField'
import Button from '../../components/Button'
import LoadingButton from '../../components/LoadingButton'
import {AuthContext} from '../../contexts/auth'
import {hasFormEmptyField} from '../../utils/authHelpers'
import {useSnackbar} from '../../hooks/useSnackbar'
import {INIT_FORM_STATE, MIN_PASS_LENGTH} from './constants'

const SignupPage = () => {
  const navigate = useNavigate()
  const {enqueueSnackbar, closeSnackbar} = useSnackbar()
  const {auth} = useContext(AuthContext)

  const [isLoading, setIsLoading] = useState(false)
  const [form, setForm] = useState(INIT_FORM_STATE)

  const resetForm = () => {
    setForm(INIT_FORM_STATE)
  }

  const resetFormPasswords = () => {
    setForm((prev) => ({
      ...prev,
      password: '',
      repeatPassword: ''
    }))
  }

  const handleSignup = async (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    event.preventDefault()
    if (form.password !== form.repeatPassword) {
      enqueueSnackbar('Пароли не совпадают', {
        variant: 'error',
        onlyBottom: true
      })
      resetFormPasswords()
      return
    }

    if (form.password !== form.password.trim()) {
      enqueueSnackbar('Не используйте пробел в началу и конце пароля', {
        variant: 'warning',
        onlyBottom: true
      })
      resetFormPasswords()
      return
    }

    setIsLoading(true)
    createUserWithEmailAndPassword(auth, form.email.trim(), form.password)
      .then(() => {
        navigate('/')
        closeSnackbar()
        enqueueSnackbar('Вы успешно зарегистрировались', {variant: 'success'})
      })
      .catch(() => {
        resetForm()
        enqueueSnackbar('Не удалось зарегистрироваться', {
          variant: 'error',
          onlyBottom: true
        })
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  const goToLoginPage = () => {
    navigate('/login')
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

  const isSignupDisabled =
    hasFormEmptyField(form) ||
    form.password.length < MIN_PASS_LENGTH ||
    form.repeatPassword.length < MIN_PASS_LENGTH

  return (
    <AuthFormWrapper title="Регистрация">
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
      <TextField
        required
        label="Повторить пароль"
        name="repeatPassword"
        onChange={handleChangeField}
        value={form.repeatPassword}
        type="password"
        disabled={isLoading}
      />
      <LoadingButton
        type="submit"
        onClick={handleSignup}
        loading={isLoading}
        disabled={isSignupDisabled}
      >
        Зарегистрироваться
      </LoadingButton>
      <Button onClick={goToHomeGuest} disabled={isLoading}>
        Войти как гость
      </Button>
      <Link
        component="button"
        variant="body2"
        onClick={goToLoginPage}
        disabled={isLoading}
      >
        Уже есть аккаунт? Войти
      </Link>
    </AuthFormWrapper>
  )
}

export default SignupPage
