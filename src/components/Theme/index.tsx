import React, {PropsWithChildren} from 'react'
import {createTheme, ThemeProvider} from '@mui/material/styles'

const theme = createTheme({
  palette: {
    primary: {
      main: '#204030'
    },
    secondary: {
      main: '#8f1010'
    },
    text: {
      primary: '#000000'
    },
    common: {
      black: '#000000',
      white: '#FAFCFF'
    }
  }
})

const Theme: React.FC<PropsWithChildren> = (props) => {
  const {children} = props

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>
}

export default Theme
