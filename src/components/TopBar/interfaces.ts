import React from 'react'

export interface TopBarProps {
  isNavbarShown: boolean
  setIsNavbarShown: React.Dispatch<React.SetStateAction<boolean>>
}
