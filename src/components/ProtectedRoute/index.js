import React, {useContext} from 'react'
import {Navigate} from 'react-router-dom'
import {AuthContext} from '../../contexts/auth'

const ProtectedRoute = (props) => {
  const {children} = props

  const {currentUser} = useContext(AuthContext)

  if (!currentUser) {
    return <Navigate replace to="/login" />
  }

  return children
}

export default ProtectedRoute
