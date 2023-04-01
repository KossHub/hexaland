import React from 'react'
import {Navigate} from 'react-router-dom'
import {useAuthContext} from '../../contexts/auth/useAuthContext'

const ProtectedRoute = (props) => {
  const {children} = props

  const {currentUser} = useAuthContext()

  if (!currentUser) {
    return <Navigate replace to="/login" />
  }

  return children
}

export default ProtectedRoute
