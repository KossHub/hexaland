import React from 'react'
import {Toolbar, IconButton, Typography} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

import SlideTransition from '../SlideTransition'
import {FullscreenModalProps} from './interfaces'
import * as UI from './styles'

const FullscreenModal: React.FC<FullscreenModalProps> = (props) => {
  const {
    isOpen,
    isCloseDisabled = false,
    title,
    onClose,
    button,
    children
  } = props

  return (
    <UI.Dialog
      fullScreen
      open={isOpen}
      onClose={onClose}
      TransitionComponent={SlideTransition}
    >
      <UI.AppBar color="secondary">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={onClose}
            aria-label="close"
            disabled={isCloseDisabled}
          >
            <CloseIcon />
          </IconButton>
          <Typography sx={{ml: 2, flex: 1}} variant="h6" component="div">
            {title}
          </Typography>
          {button}
        </Toolbar>
      </UI.AppBar>

      {children}
    </UI.Dialog>
  )
}

export default FullscreenModal
