import React, {useState, useEffect, PropsWithChildren} from 'react'
import {useMediaQuery} from '@mui/material'

import {NOTIFICATION_POSITION} from './constants'
import * as UI from './styles'

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
    <UI.Provider
      preventDuplicate
      dense={isSmallScreen}
      maxSnack={isSmallScreen ? 3 : 5}
      anchorOrigin={position}
    >
      {children}
    </UI.Provider>
  )
}

export default SnackbarProvider
