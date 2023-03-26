import React from 'react'
import dayjs from 'dayjs'
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import {CssBaseline, GlobalStyles} from '@mui/material'

import 'firebase/auth'
import 'dayjs/locale/ru'

import ProtectedRoute from '../ProtectedRoute'
import HexaPage from '../../pages/HexaPage'
import LoginPage from '../../pages/LoginPage'
import SignupPage from '../../pages/SignupPage'
import ForgotPassword from '../../pages/ForgotPassword'
import WelcomePage from '../../pages/WelcomePage'
import NotFound from '../../pages/NotFound'
import SnackbarProvider from '../../contexts/snackbar'
import AuthProvider from '../../contexts/auth'
import Theme from '../Theme'

const App = () => {
  dayjs.locale('ru')

  return (
    <BrowserRouter>
      <CssBaseline />
      <GlobalStyles
        styles={{
          body: {
            overscrollBehavior: 'none' // disable refresh page behavior on mobile
          }
        }}
      />
      <Theme>
        <SnackbarProvider>
          <AuthProvider>
            <Routes>
              <Route
                index
                element={
                  <ProtectedRoute>
                    <HexaPage />
                  </ProtectedRoute>
                }
              />
              <Route path="login" element={<LoginPage />} />
              <Route path="signup" element={<SignupPage />} />
              <Route path="forgot-password" element={<ForgotPassword />} />
              <Route path="welcome" element={<WelcomePage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </SnackbarProvider>
      </Theme>
    </BrowserRouter>
  )
}

export default App
