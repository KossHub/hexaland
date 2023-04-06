import React from 'react'
import {Link, Typography, Container} from '@mui/material'
import {useNavigate} from 'react-router-dom'

import {QRDonationIcon} from '../../assets/QRDonationIcon'
import {useSnackbar} from '../../contexts/snackbar/useSnackbar'

const WelcomePage = () => {
  const navigate = useNavigate()
  const {closeSnackbar} = useSnackbar()

  const goToHomePage = () => {
    closeSnackbar()
    navigate('/', {replace: true})
  }

  return (
    <Container maxWidth="lg">
      <Typography variant="h2" mt={8} mb={2}>
        О проекте
      </Typography>

      <Link component="button" variant="body2" onClick={goToHomePage}>
        На главную
      </Link>

      <Typography variant="body1" mt={2} mb={8}>
        [ здесь будет описание ]
      </Typography>

      <Typography variant="body1" ml={3}>
        Поддержать проект
      </Typography>
      <QRDonationIcon />
    </Container>
  )
}

export default WelcomePage
