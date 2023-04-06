import React, {useEffect, useState} from 'react'
import {Avatar, Divider, Menu, MenuItem, PopoverOrigin} from '@mui/material'
import {
  Logout as LogoutIcon,
  Settings as SettingsIcon,
  CreditScore as CreditScoreIcon,
  FullscreenRounded as FullscreenRoundedIcon,
  FullscreenExitRounded as FullscreenExitRoundedIcon
} from '@mui/icons-material'

import {useAuthContext} from '../../contexts/auth/useAuthContext'
import {useModalsContext} from '../../contexts/modals/useModalsContext'
import {useSnackbar} from '../../contexts/snackbar/useSnackbar'
import {MODAL_NAME} from '../../contexts/modals/constants'
import {UserMenuProps} from './interfaces'

const UserMenu = (props: UserMenuProps) => {
  const {anchorEl, isMobile, onClose} = props

  const [isFullscreen, setIsFullscreen] = useState(false)

  const {currentUser} = useAuthContext()
  const {setOpenedModal} = useModalsContext()
  const {enqueueSnackbar} = useSnackbar()

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

  const openFullscreen = async () => {
    const elem = document.documentElement

    if (elem.requestFullscreen) {
      await elem.requestFullscreen()
    } else if ((elem as any).webkitRequestFullscreen) {
      await (elem as any).webkitRequestFullscreen() /** for Safari */
    } else if ((elem as any).msRequestFullscreen) {
      await (elem as any).msRequestFullscreen() /** for IE11 */
    } else {
      enqueueSnackbar('Полноэкранный режим не поддерживается', {
        variant: 'error'
      })
    }
  }

  const closeFullscreen = async () => {
    if (!document) {
      return
    }

    if (document.exitFullscreen) {
      await document.exitFullscreen()
    } else if ((document as any).webkitExitFullscreen) {
      /** for Safari */
      await (document as any).webkitExitFullscreen()
    } else if ((document as any).msExitFullscreen) {
      /** for IE11 */
      await (document as any).msExitFullscreen()
    } else {
      enqueueSnackbar(
        <>
          Не удалось выйти из полноэкранного режима
          <br />
          Попробуйте нажать Esc или перезагрузить страницу
        </>,
        {variant: 'error'}
      )
    }

    if (!isFullscreen) {
      document.documentElement.scrollTo({top: -64})
    }
  }

  const toggleFullscreen = async () => {
    onClose()

    if (isFullscreen) {
      await closeFullscreen()
    } else {
      await openFullscreen()
    }
  }

  useEffect(() => {
    return () => {
      if (document.fullscreenElement) {
        closeFullscreen()
      }
    }
  }, [])

  useEffect(() => {
    const handler = () => {
      setIsFullscreen(Boolean(document.fullscreenElement))
    }

    document.addEventListener('fullscreenchange', handler)

    return () => {
      document.removeEventListener('fullscreenchange', handler)
    }
  }, [])

  return (
    <Menu
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
      <MenuItem onClick={toggleFullscreen}>
        {isFullscreen ? (
          <FullscreenExitRoundedIcon
            sx={{mr: 2}}
            fontSize="small"
            color="action"
          />
        ) : (
          <FullscreenRoundedIcon sx={{mr: 2}} fontSize="small" color="action" />
        )}

        {isFullscreen
          ? 'Выйти из полноэкранного режима'
          : 'Полноэкранный режим'}
      </MenuItem>
      <MenuItem onClick={handleOpenDonationModal}>
        <CreditScoreIcon sx={{mr: 2}} fontSize="small" color="action" />
        Поддержать проект
      </MenuItem>
      <Divider />
      <MenuItem onClick={handleLogout}>
        <LogoutIcon sx={{mr: 2}} fontSize="small" color="action" />
        Выйти из аккаунта (v0.1.9)
      </MenuItem>
    </Menu>
  )
}

export default UserMenu
