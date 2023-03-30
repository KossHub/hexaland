import React, {useContext} from 'react'
import {Avatar, Divider, Menu, MenuItem, PopoverOrigin} from '@mui/material'
import {
  Logout as LogoutIcon,
  Settings as SettingsIcon,
  CreditScore as CreditScoreIcon
} from '@mui/icons-material'

import {AuthContext} from '../../contexts/auth'
import {ModalsContext} from '../../contexts/modals'
import {MODAL_NAME} from '../../contexts/modals/constants'
import {UserMenuProps} from './interfaces'

const UserMenu = (props: UserMenuProps) => {
  const {anchorEl, isMobile, onClose} = props

  const {currentUser} = useContext(AuthContext)
  const {setOpenedModal} = useContext(ModalsContext)

  const transformOrigin: PopoverOrigin = isMobile
    ? {horizontal: 'left', vertical: 'bottom'}
    : {horizontal: 'right', vertical: 'top'}
  const anchorOrigin: PopoverOrigin = isMobile
    ? {horizontal: 'left', vertical: 'top'}
    : {horizontal: 'right', vertical: 'top'}

  const handleOpenUserProfileModal = () => {
    onClose()
    setOpenedModal(MODAL_NAME.USER_PROFILE)
  }

  const handleOpenSettingsModal = () => {
    onClose()
    setOpenedModal(MODAL_NAME.SETTINGS)
  }

  const handleOpenDonationModal = () => {
    onClose()
    setOpenedModal(MODAL_NAME.DONATION)
  }

  const handleLogout = () => {
    onClose()
    setOpenedModal(MODAL_NAME.CONFIRM_LOGOUT)
  }

  return (
    <Menu
      // keepMounted FIXME: remove ?
      id="user-menu-appbar"
      anchorEl={anchorEl}
      transformOrigin={transformOrigin}
      anchorOrigin={anchorOrigin}
      open={Boolean(anchorEl)}
      onClose={onClose}
    >
      <MenuItem onClick={handleOpenUserProfileModal}>
        <Avatar sx={{mr: 1, ml: -0.5, width: 32, height: 32}} />
        {currentUser?.email}
      </MenuItem>
      <Divider />
      <MenuItem onClick={handleOpenSettingsModal} disabled>
        <SettingsIcon sx={{mr: 2}} fontSize="small" color="action" />
        Настройки
      </MenuItem>
      <MenuItem onClick={handleOpenDonationModal}>
        <CreditScoreIcon sx={{mr: 2}} fontSize="small" color="action" />
        Поддержать проект
      </MenuItem>
      <Divider />
      <MenuItem onClick={handleLogout}>
        <LogoutIcon sx={{mr: 2}} fontSize="small" color="action" />
        Выйти из аккаунта (v1.0.14)
      </MenuItem>
    </Menu>
  )
}

export default UserMenu
