import React from 'react'
import {LoadingButtonProps} from '@mui/lab/LoadingButton'

import * as UI from './styles'

const LoadingButton: React.FC<LoadingButtonProps> = (props) => {
  const {children, ...restProps} = props

  return (
    <UI.LoadingButton variant="outlined" {...restProps}>
      {children}
    </UI.LoadingButton>
  )
}

export default LoadingButton
