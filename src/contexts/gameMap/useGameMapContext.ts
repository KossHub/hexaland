import {useContext} from 'react'

import {GameMapContextState} from './interfaces'
import {GameMapContext} from './index'

export const useGameMapContext = () => {
  const context = useContext(GameMapContext)

  if (context === undefined) {
    throw new Error('useGameMapContext was used outside of its Provider')
  }

  return context as GameMapContextState
}
