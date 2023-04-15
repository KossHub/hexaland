import {styled} from '@mui/material/styles'
import {Box, Container} from '@mui/material'

export const Wrapper = styled(Container)(({theme}) => ({
  display: 'flex',
  height: '100%'
}))

export const LandscapeButtonsWrapper = styled(Box)(({theme}) => ({
  display: 'flex',
  flexWrap: 'wrap',
  width: '100%',
  marginBottom: 16,
  overflow: 'auto',
  height: 'fit-content',
  gap: '0 10px',

  '& > button:nth-of-type(7n - 2)': {
    marginLeft: 36
  }
}))
