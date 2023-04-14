import {styled} from '@mui/material/styles'
import {Box, Container} from '@mui/material'

export const Wrapper = styled(Container)(({theme}) => ({
  display: 'flex',
  height: '100%'
}))

export const LandscapeButtonsWrapper = styled(Box)(({theme}) => ({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0 4px',
  width: '100%',
  marginBottom: 16,
  overflow: 'auto',
  height: 'fit-content',

  '& > button:nth-child(10n + 1)': {
    marginLeft: 26
  }
}))
