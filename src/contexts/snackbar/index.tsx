import React, {useState, useEffect, PropsWithChildren} from 'react'
import {useMediaQuery} from '@mui/material'
import {SnackbarProvider as NotistackSnackbarProvider} from 'notistack'

import {NOTIFICATION_POSITION} from './constants'

const SnackbarProvider: React.FC<PropsWithChildren> = (props) => {
  const {children} = props

  const [position, setPosition] = useState(NOTIFICATION_POSITION.BOTTOM)

  const isSmallScreen = useMediaQuery('(max-width: 900px)')

  useEffect(() => {
    if (isSmallScreen) {
      setPosition(NOTIFICATION_POSITION.TOP)
    } else {
      setPosition(NOTIFICATION_POSITION.BOTTOM)
    }
  }, [isSmallScreen])

  return (
    <NotistackSnackbarProvider
      preventDuplicate
      dense={isSmallScreen}
      maxSnack={isSmallScreen ? 3 : 5}
      anchorOrigin={position}
    >
      {children}
    </NotistackSnackbarProvider>
  )
}

export default SnackbarProvider
