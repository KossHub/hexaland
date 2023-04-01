import React from 'react'
import {Tooltip as MuiTooltip, TooltipProps} from '@mui/material'

const Tooltip: React.FC<TooltipProps> = (props) => (
  <MuiTooltip arrow enterNextDelay={500} {...props} />
)

export default Tooltip
