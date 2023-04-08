import React, {useState} from 'react'
import {SpeedDial, SpeedDialAction, SpeedDialIcon} from '@mui/material'
import FileCopyIcon from '@mui/icons-material/FileCopyOutlined'
import SaveIcon from '@mui/icons-material/Save'
import PrintIcon from '@mui/icons-material/Print'
import ShareIcon from '@mui/icons-material/Share'
import EditIcon from '@mui/icons-material/Edit'

import {ActionItem, ActionListMenuProps} from './interfaces'

// FIXME: to remove
const defaultActions = [
  {icon: <FileCopyIcon />, name: 'Copy', onClick: () => null},
  {
    icon: <SaveIcon />,
    name: 'Save',
    keepOpen: true,
    onClick: () => null
  },
  {icon: <PrintIcon />, name: 'Print', onClick: () => null},
  {icon: <ShareIcon />, name: 'Share', onClick: () => null}
]

const ActionListMenu: React.FC<ActionListMenuProps> = (props) => {
  const {actions = defaultActions} = props

  const [isOpen, setIsOpen] = useState(false)

  const handleClose = () => {
    setIsOpen(false)
  }

  const handleAction = (
    onClick: ActionItem['onClick'],
    keepOpen: ActionItem['keepOpen']
  ) => {
    if (!keepOpen) {
      handleClose()
    }

    onClick()
  }

  return (
    <SpeedDial
      open={isOpen}
      onClose={handleClose}
      onOpen={() => setIsOpen(true)}
      ariaLabel="SpeedDial openIcon example"
      sx={{position: 'absolute', bottom: 16, right: 'calc(50% - 28px)'}}
      icon={<SpeedDialIcon openIcon={<EditIcon />} />}
    >
      {actions.map((action) => (
        <SpeedDialAction
          key={action.name}
          icon={action.icon}
          onClick={() => handleAction(action.onClick, action.keepOpen)}
        />
      ))}
    </SpeedDial>
  )
}

export default ActionListMenu
