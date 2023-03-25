import React, {useContext} from 'react'
import {signOut} from 'firebase/auth'
import {useNavigate} from 'react-router-dom'
import {Dialog, DialogTitle, DialogActions, Button} from '@mui/material'

import {ModalsContext} from '../../contexts/modals'
import {MODAL_NAME} from '../../contexts/modals/constants'
import {AuthContext} from '../../contexts/auth'
import {useSnackbar} from '../../hooks/useSnackbar'

const ConfirmLogoutModal = () => {
  const navigate = useNavigate()
  const {closeSnackbar} = useSnackbar()
  const {auth} = useContext(AuthContext)

  const {openedModal, setOpenedModal} = useContext(ModalsContext)

  const isOpen = openedModal === MODAL_NAME.CONFIRM_LOGOUT

  const handleClose = () => {
    setOpenedModal(null)
  }

  const handleLogout = () => {
    handleClose()
    closeSnackbar()
    signOut(auth).then(() => {
      navigate('/login')
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
