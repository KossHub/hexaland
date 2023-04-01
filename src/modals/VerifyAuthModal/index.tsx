import React, {useState} from 'react'
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Button
} from '@mui/material'

import TextField from '../../components/TextField'
import {VerifyAuthModalProps} from './interfaces'
import {useVerifyUser} from '../../hooks/useVerifyUser'
import {useSnackbar} from '../../contexts/snackbar/useSnackbar'
import {MIN_PASS_LENGTH} from '../../pages/SignupPage/constants'

const VerifyAuthModal: React.FC<VerifyAuthModalProps> = (props) => {
  const {isOpen, onClose, onSuccess} = props

  const verifyUser = useVerifyUser()
  const {enqueueSnackbar} = useSnackbar()

  const [isLoading, setIsLoading] = useState(false)
  const [password, setPassword] = useState('')

  const handleClose = () => {
    setIsLoading(false)
    setPassword('')
    onClose()
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
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

    onSuccess()
    handleClose()
  }

  return (
    <Dialog
      fullWidth
      open={isOpen}
      onClose={handleClose}
      disableEscapeKeyDown={isLoading}
      maxWidth="xs"
    >
      <DialogTitle>Введите пароль</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent sx={{pt: 0}}>
          <TextField
            autoFocus
            required
            label="Пароль"
            type="password"
            variant="standard"
            onChange={(event) => setPassword(event.target.value)}
            disabled={isLoading}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={isLoading}>
            Отменить
          </Button>
          <Button
            variant="contained"
            color="secondary"
            type="submit"
            disabled={isLoading || password.length < MIN_PASS_LENGTH}
          >
            Отправить
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default VerifyAuthModal
