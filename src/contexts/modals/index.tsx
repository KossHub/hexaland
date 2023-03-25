import React, {createContext, useState} from 'react'

import {ModalsContextState, ModalsProviderProps, ModalName} from './interfaces'

export const ModalsContext = createContext<ModalsContextState>({
  openedModal: null,
  setOpenedModal: () => null
})

const ModalsProvider: React.FC<ModalsProviderProps> = (props) => {
  const {children} = props

  const [openedModal, setOpenedModal] = useState<null | ModalName>(null)

  const contextValue: ModalsContextState = {
    openedModal,
    setOpenedModal
  }

  return (
    <ModalsContext.Provider value={contextValue}>
      {children}
    </ModalsContext.Provider>
  )
}

export default ModalsProvider
