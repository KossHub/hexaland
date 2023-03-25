import React from 'react'
import {Link, Typography} from '@mui/material'
import {useNavigate} from 'react-router-dom'
import {Container} from '@mui/material'

import {QRDonationIcon} from '../../assets/QRDonationIcon'
import {useSnackbar} from '../../hooks/useSnackbar'

const WelcomePage = () => {
  const navigation = useNavigate()
  const {closeSnackbar} = useSnackbar()

  const goToSignupPage = () => {
    closeSnackbar()
    navigation('/signup')
  }

  return (
    <Container maxWidth="lg">
      <Typography variant="h2" mt={8} mb={2}>
        О проекте
      </Typography>

      <Link component="button" variant="body2" onClick={goToSignupPage}>
        Перейти к регистрации
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
