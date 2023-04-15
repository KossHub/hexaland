import {Outlet, Navigate} from 'react-router-dom'

import Loader from '../Loader'
import ModalsProvider from '../../contexts/modals'
import MapProvider from '../../contexts/map'
import Map2DViewProvider from '../../contexts/map2DView'
import {useAuthContext} from '../../contexts/auth/useAuthContext'

const AuthenticatedRoute = () => {
  const {currentUser} = useAuthContext()

  const isLoading = currentUser === undefined

  if (isLoading) {
    return <Loader />
  }

  return currentUser ? (
    <ModalsProvider>
      <Map2DViewProvider>
        <MapProvider>
          <Outlet />
        </MapProvider>
      </Map2DViewProvider>
    </ModalsProvider>
  ) : (
    <Navigate to="/login" />
  )
}

export default AuthenticatedRoute
