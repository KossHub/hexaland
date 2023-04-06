import {CircularProgress} from '@mui/material'

const Loader = () => (
  <CircularProgress
    color="primary"
    sx={{
      position: 'absolute',
      top: 'calc(50% - 20px)',
      left: 'calc(50% - 20px)'
    }}
  />
)

export default Loader
