import {css} from '@mui/material/styles'

export const globalStyles = css({
  html: {
    height: '100% !important',
    overflow: 'hidden',
    overscrollBehavior: 'none' // disable refresh page behavior on mobile
  },
  body: {
    height: '100%',
    overscrollBehavior: 'none'
  },
  ['#root']: {
    height: '100%',
    overscrollBehavior: 'none'
  }
})
