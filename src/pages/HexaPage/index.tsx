import React, {useState} from 'react'

import TopBar from '../../components/TopBar'
import MobileMenu from '../../components/MobileMenu'
import Canvas from '../../components/Canvas'
import UserProfileModal from '../../modals/UserProfileModal'
import SettingsModal from '../../modals/SettingsModal'
import DonationModal from '../../modals/DonationModal'
import ConfirmLogoutModal from '../../modals/ConfirmLogoutModal'
import CanvasProvider from '../../contexts/canvas'
import ModalsProvider from '../../contexts/modals'
import * as UI from './styles'

const HexaPage = () => {
  const [isNavbarShown, setIsNavbarShown] = useState(true)

  return (
    <ModalsProvider>
      <TopBar
        isNavbarShown={isNavbarShown}
        setIsNavbarShown={setIsNavbarShown}
      />

      <UI.PageContainer maxWidth={false}>
        <CanvasProvider>
          <MobileMenu />
          <Canvas />
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
