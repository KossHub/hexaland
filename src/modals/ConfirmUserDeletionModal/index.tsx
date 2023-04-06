import React, {useEffect, useState} from 'react'
import {deleteUser} from 'firebase/auth'
import {User as FirebaseUser} from 'firebase/auth'
import {useNavigate} from 'react-router-dom'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Button
} from '@mui/material'

import TextField from '../../components/TextField'
import {useAuthContext} from '../../contexts/auth/useAuthContext'
import {ConfirmUserDeletionModalProps} from './interfaces'
import {useVerifyUser} from '../../hooks/useVerifyUser'
import {useSnackbar} from '../../contexts/snackbar/useSnackbar'
import {MIN_PASS_LENGTH} from '../../pages/SignupPage/constants'
import * as UI from './styles'

const ConfirmUserDeletionModal: React.FC<ConfirmUserDeletionModalProps> = (
  props
) => {
  const {isOpen, onClose} = props

  const navigate = useNavigate()
  const verifyUser = useVerifyUser()
  const {currentUser} = useAuthContext()
  const {enqueueSnackbar, closeSnackbar} = useSnackbar()

  const [isLoading, setIsLoading] = useState(false)
  const [password, setPassword] = useState('')

  useEffect(() => {
    if (!isOpen) {
      setIsLoading(false)
      setPassword('')
    }
  }, [isOpen])

  const handleDelete = async () => {
    setIsLoading(true)

    const isVerified = await verifyUser(password)

    if (!isVerified) {
      onClose()
      setIsLoading(false)
      enqueueSnackbar('Неверный пароль или нет соединения с сервером', {
        variant: 'error',
        onlyBottom: true
      })
      return
    }

    try {
      await deleteUser(currentUser as FirebaseUser)
      closeSnackbar()
      navigate('/login', {replace: true})
      enqueueSnackbar('Аккаунт успешно удален', {
        variant: 'success',
        onlyBottom: true
      })
    } catch {
      onClose()
      setIsLoading(false)
      enqueueSnackbar('Не получилось удалить аккаунт', {
        variant: 'error',
        onlyBottom: true
      })
    }
  }

  return (
    <Dialog
      fullWidth
      open={isOpen}
      onClose={onClose}
      disableEscapeKeyDown={isLoading}
      maxWidth="xs"
    >
      <DialogTitle color="error">
        <UI.WarningRoundedIcon />
        Удаление аккаунта
      </DialogTitle>

      <DialogContent>
        Вы действительно хотите удалить аккаунт
        <br />
        {currentUser?.email}?
        <br />
        <br />
        Отменить действие будет невозможно.
        <TextField
          autoFocus
          required
          label="Пароль"
          type="password"
          variant="standard"
          onChange={(event) => setPassword(event.target.value)}
          sx={{mt: 2}}
          disabled={isLoading}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isLoading}>
          Отменить
        </Button>
        <Button
          color="error"
          variant="contained"
          onClick={handleDelete}
          disabled={isLoading || password.length < MIN_PASS_LENGTH}
        >
          Подтвердить
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ConfirmUserDeletionModal
