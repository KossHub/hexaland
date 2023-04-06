import React, {useEffect, useState} from 'react'

import TopBar from '../../components/TopBar'
import Canvas from '../../components/Canvas'
import UserProfileModal from '../../modals/UserProfileModal'
import SettingsModal from '../../modals/SettingsModal'
import DonationModal from '../../modals/DonationModal'
import ConfirmLogoutModal from '../../modals/ConfirmLogoutModal'
import CanvasProvider from '../../contexts/canvas'
import GameMapProvider from '../../contexts/game'
import ModalsProvider from '../../contexts/modals'
import MobileMenu from '../../components/MobileMenu'
import * as UI from './styles'

const HexaPage = () => {
  const [isNavbarShown, setIsNavbarShown] = useState(true)

  useEffect(() => {
    window.onbeforeunload = () => ''
  }, []) // TODO: add dependency isInGame

  return (
    <ModalsProvider>
      <TopBar
        isNavbarShown={isNavbarShown}
        setIsNavbarShown={setIsNavbarShown}
      />

      <UI.PageContainer maxWidth={false}>
        <CanvasProvider>
          <GameMapProvider>
            <Canvas />
            <MobileMenu />
          </GameMapProvider>
        </CanvasProvider>
        <UserProfileModal />
        <SettingsModal />
        <DonationModal />
        <ConfirmLogoutModal />
      </UI.PageContainer>
    </ModalsProvider>
  )
}

export default HexaPage
