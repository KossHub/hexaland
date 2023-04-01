import {useContext} from 'react'

import {AuthContextState} from './interfaces'
import {AuthContext} from './index'

export const useAuthContext = () => {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error('useAuthContext was used outside of its Provider')
  }

  return context as AuthContextState
}
