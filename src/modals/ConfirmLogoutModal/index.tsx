import React from 'react'
import {signOut} from 'firebase/auth'
import {useNavigate} from 'react-router-dom'
import {Dialog, DialogTitle, DialogActions, Button} from '@mui/material'

import {useModalsContext} from '../../contexts/modals/useModalsContext'
import {useAuthContext} from '../../contexts/auth/useAuthContext'
import {useSnackbar} from '../../contexts/snackbar/useSnackbar'
import {MODAL_NAME} from '../../contexts/modals/constants'

const ConfirmLogoutModal = () => {
  const navigate = useNavigate()
  const {closeSnackbar} = useSnackbar()
  const {auth} = useAuthContext()
  const {openedModal, setOpenedModal} = useModalsContext()

  const isOpen = openedModal === MODAL_NAME.CONFIRM_LOGOUT

  const handleClose = () => {
    setOpenedModal(null)
  }

  const handleLogout = () => {
    handleClose()
    closeSnackbar()
    signOut(auth).then(() => {
      navigate('/login', {replace: true})
    })
  }

  return (
    <Dialog fullWidth open={isOpen} onClose={handleClose} maxWidth="xs">
      <DialogTitle>Вы действительно хотите выйти?</DialogTitle>
      <DialogActions>
        <Button onClick={handleClose}>Нет</Button>
        <Button color="error" variant="contained" onClick={handleLogout}>
          Да
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ConfirmLogoutModal
