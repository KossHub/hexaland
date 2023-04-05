import React, {createContext, useRef, PropsWithChildren} from 'react'

import {GameContextState} from './interfaces'

export const GameContext = createContext<null | GameContextState>(null)

const GameProvider: React.FC<PropsWithChildren> = (props) => {
  const {children} = props

  const gameRef = useRef<GameContextState['game']>(null)
  const hoveredHexRef = useRef<GameContextState['hoveredHex']>(null)
  const selectedHexRef = useRef<GameContextState['selectedHex']>(null)

  const contextValue: GameContextState = {
    game: gameRef.current,
    hoveredHex: hoveredHexRef.current,
    selectedHex: selectedHexRef.current
  }

  return (
    <GameContext.Provider value={contextValue}>
      {children}
    </GameContext.Provider>
  )
}

export default GameProvider
