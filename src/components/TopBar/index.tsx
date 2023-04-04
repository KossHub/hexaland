import React, {useState} from 'react'
import {AppBar, IconButton, Slide, Toolbar, Typography} from '@mui/material'
import {
  AccountCircle as AccountCircleIcon,
  ArrowUpward as ArrowUpwardIcon,
  DragHandleRounded as DragHandleRoundedIcon
} from '@mui/icons-material'

import UserMenu from '../UserMenu'
import Tooltip from '../../components/Tooltip'
import {TopBarProps} from './interfaces'
import * as UI from './styles'

const TopBar: React.FC<TopBarProps> = (props) => {
  const {isNavbarShown, setIsNavbarShown} = props

  const [userMenuAnchorEl, setUserMenuAnchorEl] = useState<null | HTMLElement>(
    null
  )

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchorEl(event.currentTarget)
  }

  return (
    <>
      <UI.NavbarWrapper appear={false} direction="down" in={isNavbarShown}>
        <AppBar>
          <Toolbar>
            <IconButton
              onClick={() => setIsNavbarShown(false)}
              color="inherit"
              sx={{mr: 2}}
            >
              <ArrowUpwardIcon aria-label="menu" />
            </IconButton>
            <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
              HEXALand
            </Typography>
            <Tooltip title="Меню пользователя" placement="bottom-start">
              <IconButton
                size="large"
                aria-controls="user-menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenUserMenu}
                color="inherit"
              >
                <AccountCircleIcon />
              </IconButton>
            </Tooltip>
            <UserMenu
              anchorEl={userMenuAnchorEl}
              onClose={() => setUserMenuAnchorEl(null)}
            />
          </Toolbar>
        </AppBar>
      </UI.NavbarWrapper>

      <Slide appear={false} direction="down" in={!isNavbarShown}>
        <UI.ShowMenuButton
          color="primary"
          onClick={() => setIsNavbarShown(true)}
        >
          <DragHandleRoundedIcon aria-label="menu" />
        </UI.ShowMenuButton>
      </Slide>
    </>
  )
}

export default TopBar
