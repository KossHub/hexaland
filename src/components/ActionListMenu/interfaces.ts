import React from 'react'

export interface ActionItem {
  icon: React.ReactNode
  onClick: () => void
  name?: string
  /** Keep menu opened when onClick will be handled */
  keepOpen?: boolean
}

export interface ActionListMenuProps {
  actions?: ActionItem[]
}
