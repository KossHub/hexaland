import React from 'react'
import {Container, Link, Typography} from '@mui/material'
import {useNavigate} from 'react-router-dom'

const NotFound = () => {
  const navigate = useNavigate()

  const goToHomePage = () => {
    navigate('/')
  }

  return (
    <Container maxWidth="lg">
      <Typography variant="h2" mt={4} mb={4}>
        404: Page not found 😔
      </Typography>

      <Link component="button" variant="body2" onClick={goToHomePage}>
        На главную
      </Link>
    </Container>
  )
}

export default NotFound
