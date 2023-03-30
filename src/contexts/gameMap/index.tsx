import React, {createContext, useRef, PropsWithChildren} from 'react'

import {GameMapContextState} from './interfaces'

export const GameMapContext = createContext<null | GameMapContextState>(null)

const GameMapProvider: React.FC<PropsWithChildren> = (props) => {
  const {children} = props

  const gameMapRef = useRef<GameMapContextState['gameMap']>(null)

  const contextValue: GameMapContextState = {
    gameMap: gameMapRef.current
  }

  return (
    <GameMapContext.Provider value={contextValue}>
      {children}
    </GameMapContext.Provider>
  )
}

export default GameMapProvider
