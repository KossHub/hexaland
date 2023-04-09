import React from 'react'
import dayjs from 'dayjs'
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import {CssBaseline, GlobalStyles} from '@mui/material'

import 'firebase/auth'
import 'dayjs/locale/ru'

import AuthenticatedRoute from '../AuthenticatedRoute'
import UnauthenticatedRoute from '../UnauthenticatedRoute'
import HexaPage from '../../pages/HexaPage'
import MapEditorPage from '../../pages/MapEditorPage'
import LoginPage from '../../pages/LoginPage'
import SignupPage from '../../pages/SignupPage'
import ForgotPassword from '../../pages/ForgotPassword'
import WelcomePage from '../../pages/WelcomePage'
import NotFound from '../../pages/NotFound'
import SnackbarProvider from '../../contexts/snackbar'
import AuthProvider from '../../contexts/auth'
import Theme from '../Theme'
import PreHome from '../PreHome'

const App = () => {
  dayjs.locale('ru')

  return (
    <BrowserRouter>
      <CssBaseline />
      <GlobalStyles
        // TODO: move to a separate file
        styles={{
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
        }}
      />
      <Theme>
        <SnackbarProvider>
          <AuthProvider>
            <Routes>
              <Route element={<UnauthenticatedRoute />}>
                <Route path="/" element={<PreHome />} />
                <Route path="login" element={<LoginPage />} />
                <Route path="signup" element={<SignupPage />} />
                <Route path="forgot-password" element={<ForgotPassword />} />
              </Route>

              <Route element={<AuthenticatedRoute />}>
                <Route path="/home" element={<HexaPage />} />
                <Route path="/map-editor" element={<MapEditorPage />} />
              </Route>

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
