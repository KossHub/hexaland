import React, {createContext, useState, useEffect} from 'react'
import {useNavigate} from 'react-router-dom'
import {
  getAuth,
  onAuthStateChanged,
  User as FirebaseUser,
  Auth as FirebaseAuth
} from 'firebase/auth'

import {AuthContextState, AuthProviderProps} from './interfaces'
import {app} from '../../firebase'

const auth: FirebaseAuth = getAuth(app)

auth.languageCode = 'ru'

export const AuthContext = createContext<AuthContextState>({
  auth,
  currentUser: null,
  setCurrentUser: () => null
})

const AuthProvider: React.FC<AuthProviderProps> = (props) => {
  const {children} = props

  const navigate = useNavigate()

  const [currentUser, setCurrentUser] = useState<null | FirebaseUser>(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user)
        navigate('/')
      }
    })

    return () => {
      unsubscribe()
    }
  }, [])

  const contextValue: AuthContextState = {
    auth,
    currentUser,
    setCurrentUser
  }

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  )
}

export default AuthProvider
