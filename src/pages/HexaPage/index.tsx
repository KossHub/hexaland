import React, {useEffect, useState} from 'react'

import TopBar from '../../components/TopBar'
import Canvas from '../../components/Canvas'
import UserProfileModal from '../../modals/UserProfileModal'
import SettingsModal from '../../modals/SettingsModal'
import DonationModal from '../../modals/DonationModal'
import ConfirmLogoutModal from '../../modals/ConfirmLogoutModal'
import MobileMenu from '../../components/MobileMenu'
import * as UI from './styles'

const HexaPage = () => {
  const [isNavbarShown, setIsNavbarShown] = useState(true)

  useEffect(() => {
    window.onbeforeunload = () => ''
  }, []) // TODO: add dependency isInGame

  return (
    <>
      <TopBar
        isNavbarShown={isNavbarShown}
        setIsNavbarShown={setIsNavbarShown}
      />

      <UI.PageContainer maxWidth={false}>
        <Canvas />
        <MobileMenu />
        <UserProfileModal />
        <SettingsModal />
        <DonationModal />
        <ConfirmLogoutModal />
      </UI.PageContainer>
    </>
  )
}

export default HexaPage
