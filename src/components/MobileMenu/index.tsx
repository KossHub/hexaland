import React, {useState, memo} from 'react'
import {BottomNavigation, BottomNavigationAction} from '@mui/material'
import {
  AccountCircle as AccountCircleIcon,
  Favorite as FavoriteIcon,
  TravelExploreRounded as TravelExploreRoundedIcon
} from '@mui/icons-material'

import UserMenu from '../UserMenu'
import ActionListMenu from '../ActionListMenu'
import * as UI from './styles'

const MobileMenu = () => {
  const [userMenuAnchorEl, setUserMenuAnchorEl] = useState<null | HTMLElement>(
    null
  )

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchorEl(event.currentTarget)
  }

  return (
    <UI.Wrapper elevation={3}>
      <BottomNavigation showLabels sx={{minWidth: 'fit-content'}}>
        <BottomNavigationAction
          label="Меню"
          aria-controls="user-menu-appbar"
          aria-haspopup="true"
          icon={<AccountCircleIcon />}
          onClick={handleOpenUserMenu}
        />
        <BottomNavigationAction label="Favorites" icon={<FavoriteIcon />} />
        <BottomNavigationAction label="Favorites" icon={<FavoriteIcon />} />
        <BottomNavigationAction
          label="Исследовать"
          icon={<TravelExploreRoundedIcon />}
        />
        <BottomNavigationAction disabled icon={<ActionListMenu />} />
      </BottomNavigation>
      <UserMenu
        isMobile
        anchorEl={userMenuAnchorEl}
        onClose={() => setUserMenuAnchorEl(null)}
      />
    </UI.Wrapper>
  )
}

export default memo(MobileMenu)
