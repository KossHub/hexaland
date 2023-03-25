import React, {useContext} from 'react'
import {Container} from '@mui/material'

import FullscreenModal from '../../components/FullscreenModal'
import {ModalsContext} from '../../contexts/modals'
import {MODAL_NAME} from '../../contexts/modals/constants'
import {useSnackbar} from '../../hooks/useSnackbar'

// import * as UI from './styles'

const SettingsModal = () => {
  const {closeSnackbar} = useSnackbar()

  const {openedModal, setOpenedModal} = useContext(ModalsContext)

  const isOpen = openedModal === MODAL_NAME.SETTINGS

  const handleClose = () => {
    closeSnackbar()
    setOpenedModal(null)
  }

  const handleSubmit = () => {
    handleClose()
  }

  return (
    <FullscreenModal isOpen={isOpen} title="Настройки" onClose={handleClose}>
      <Container maxWidth="md">Settings</Container>
    </FullscreenModal>
  )
}

export default SettingsModal
