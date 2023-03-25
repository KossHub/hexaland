import React from 'react'
import {Slide} from '@mui/material'

import {SlideTransitionProps} from './interfaces'

const SlideTransition = React.forwardRef(function Transition(
  props: SlideTransitionProps,
  ref: React.Ref<unknown>
) {
  const {children, ...restProps} = props

  return (
    <Slide direction="up" ref={ref} {...restProps}>
      {children}
    </Slide>
  )
})

export default SlideTransition
