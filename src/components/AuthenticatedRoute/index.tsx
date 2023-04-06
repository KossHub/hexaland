import {Outlet, Navigate} from 'react-router-dom'

import {useAuthContext} from '../../contexts/auth/useAuthContext'
import Loader from '../Loader'

const AuthenticatedRoute = () => {
  const {currentUser} = useAuthContext()

  const isLoading = currentUser === undefined

  if (isLoading) {
    return <Loader />
  }

  return currentUser ? <Outlet /> : <Navigate to="/login" />
}

export default AuthenticatedRoute
