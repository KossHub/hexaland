import React from 'react'

export interface FullscreenModalProps {
  isOpen: boolean
  isCloseDisabled?: boolean
  onClose: () => void
  children: React.ReactNode
  title?: string
  button?: React.ReactElement
}
