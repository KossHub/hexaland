import {styled} from '@mui/material/styles'
import {TextField as MuiTextField} from '@mui/material'

export const TextField = styled(MuiTextField)`
  width: 100%;

  // remove Chrome autofill input background color
  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  input:-webkit-autofill:active {
    transition: background-color 9999s ease-in-out 0s;
  }
`
