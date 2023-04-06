import React, {createContext, useState, useEffect} from 'react'
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
  currentUser: undefined,
  setCurrentUser: () => null
})

const AuthProvider: React.FC<AuthProviderProps> = (props) => {
  const {children} = props

  const [currentUser, setCurrentUser] = useState<AuthContextState['currentUser']>(undefined)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setCurrentUser)
    return unsubscribe
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
