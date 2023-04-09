import {Outlet, Navigate} from 'react-router-dom'

import ModalsProvider from '../../contexts/modals'
import CanvasProvider from '../../contexts/canvas'
import MapProvider from '../../contexts/map'
import Loader from '../Loader'
import {useAuthContext} from '../../contexts/auth/useAuthContext'

const AuthenticatedRoute = () => {
  const {currentUser} = useAuthContext()

  const isLoading = currentUser === undefined

  if (isLoading) {
    return <Loader />
  }

  return currentUser ? (
    <ModalsProvider>
      <CanvasProvider>
        <MapProvider>
          <Outlet />
        </MapProvider>
      </CanvasProvider>
    </ModalsProvider>
  ) : (
    <Navigate to="/login" />
  )
}

export default AuthenticatedRoute
