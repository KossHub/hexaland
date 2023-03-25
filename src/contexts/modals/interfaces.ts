import React from 'react'

import {MODAL_NAME} from './constants'

export type ModalName = (typeof MODAL_NAME)[keyof typeof MODAL_NAME]

export interface ModalsContextState {
  openedModal: null | ModalName
  setOpenedModal: React.Dispatch<React.SetStateAction<null | ModalName>>
}

export interface ModalsProviderProps {
  children: React.ReactNode
}
