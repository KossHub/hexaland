import React, {useState} from 'react'
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

  const {currentUser} = useAuthContext()
  const {setOpenedModal} = useModalsContext()
  const {enqueueSnackbar} = useSnackbar()

  const [isFullscreen, setIsFullscreen] = useState(false)

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
    const elem = document.documentElement as HTMLElement & {
      webkitRequestFullscreen: () => Promise<void>
      msRequestFullscreen: () => Promise<void>
    }

    try {
      if (elem?.requestFullscreen) {
        await elem.requestFullscreen()
      } else if (elem?.webkitRequestFullscreen) {
        await elem.webkitRequestFullscreen() /** Safari */
      } else if (elem?.msRequestFullscreen) {
        await elem.msRequestFullscreen() /** IE11 */
      }

      setIsFullscreen(true)
    } catch {
      enqueueSnackbar('Полноэкранный режим не поддерживается', {
        variant: 'error'
      })
    }
  }

  const closeFullscreen = async () => {
    const doc = document as Document & {
      webkitExitFullscreen: () => Promise<void>
      msExitFullscreen: () => Promise<void>
    }

    try {
      if (doc.exitFullscreen) {
        await doc.exitFullscreen()
      } else if (doc?.webkitExitFullscreen) {
        await doc.webkitExitFullscreen() /** Safari */
      } else if (doc?.msExitFullscreen) {
        await doc.msExitFullscreen() /** IE11 */
      }

      document.documentElement.scrollTo({top: 0, behavior: 'smooth'})

      setIsFullscreen(false)
    } catch {
      enqueueSnackbar(
        <>
          Не удалось выйти из полноэкранного режима
          <br />
          Попробуйте нажать Esc
        </>,
        {variant: 'error'}
      )
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
        Выйти из аккаунта (v1.1.0)
      </MenuItem>
    </Menu>
  )
}

export default UserMenu
