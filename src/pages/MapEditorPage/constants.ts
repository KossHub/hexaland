import {EnqueueSnackbarOptions} from '../../interfaces'

export const SIZE_LIMIT = 10000

export const SNACKBAR_POSITION: Partial<EnqueueSnackbarOptions> = {
  anchorOrigin: {horizontal: 'right', vertical: 'bottom'}
}
