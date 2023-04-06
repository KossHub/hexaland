import {useAuthContext} from '../../contexts/auth/useAuthContext'
import {useEffect} from 'react'
import {useNavigate} from 'react-router-dom'

const PreHome = () => {
  const navigate = useNavigate()
  const {currentUser} = useAuthContext()

  useEffect(() => {
    if (currentUser === null) {
      navigate('/login', {replace: true})
    }
  }, [currentUser])

  return null
}

export default PreHome
