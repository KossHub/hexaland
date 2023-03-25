import React, {useContext} from 'react'
import {Dialog, DialogContent, Typography} from '@mui/material'

import {QRDonationIcon} from '../../assets/QRDonationIcon'
import {ModalsContext} from '../../contexts/modals'
import {MODAL_NAME} from '../../contexts/modals/constants'

const DonationModal = () => {
  const {openedModal, setOpenedModal} = useContext(ModalsContext)

  return (
    <Dialog
      open={openedModal === MODAL_NAME.DONATION}
      onClose={() => setOpenedModal(null)}
    >
      <DialogContent>
        <QRDonationIcon />
        <Typography variant="body1" ml={3} mt={-2}>
          Спасибо!
        </Typography>
      </DialogContent>
    </Dialog>
  )
}

export default DonationModal
