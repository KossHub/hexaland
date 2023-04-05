import {useContext} from 'react'

import {GameContextState} from './interfaces'
import {GameContext} from './index'

export const useGameContext = () => {
  const context = useContext(GameContext)

  if (context === undefined) {
    throw new Error('useGameContext was used outside of its Provider')
  }

  return context as GameContextState
}
