import {useContext} from 'react'

import {ModalsContext} from './index'
import {ModalsContextState} from './interfaces'

export const useModalsContext = () => {
  const context = useContext(ModalsContext)

  if (context === undefined) {
    throw new Error('useModalsContext was used outside of its Provider')
  }

  return context as ModalsContextState
}
