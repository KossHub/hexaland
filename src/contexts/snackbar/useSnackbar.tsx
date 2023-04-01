import React from 'react'
import CloseIcon from '@mui/icons-material/Close'
import {IconButton} from '@mui/material'
import {
  SnackbarKey,
  SnackbarMessage,
  useSnackbar as notistackUseSnackbar
} from 'notistack'

import {EnqueueSnackbarOptions} from '../../interfaces'
import {NOTIFICATION_POSITION} from './constants'

export const useSnackbar = () => {
  const snackbar = notistackUseSnackbar()

  const enqueueSnackbar = (
    message: SnackbarMessage,
    options: EnqueueSnackbarOptions
  ): SnackbarKey => {
    const {onlyBottom, ...restOptions} = options

    return snackbar.enqueueSnackbar(message, {
      action: (key) => (
        <IconButton color="inherit" onClick={() => snackbar.closeSnackbar(key)}>
          <CloseIcon fontSize="small" />
        </IconButton>
      ),
      ...(onlyBottom && {anchorOrigin: NOTIFICATION_POSITION.BOTTOM}),
      ...restOptions
    })
  }

  return {
    enqueueSnackbar,
    closeSnackbar: snackbar.closeSnackbar
  }
}
