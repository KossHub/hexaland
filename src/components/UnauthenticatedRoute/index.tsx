import {Outlet, Navigate} from 'react-router-dom'

import {useAuthContext} from '../../contexts/auth/useAuthContext'
import Loader from '../Loader'

const UnauthenticatedRoute = () => {
  const {currentUser} = useAuthContext()

  const isLoading = currentUser === undefined

  if (isLoading) {
    return <Loader />
  }

  return currentUser ? <Navigate to="/home" /> : <Outlet />
}

export default UnauthenticatedRoute
