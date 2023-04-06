import React from 'react'
import {User as FirebaseUser, Auth as FirebaseAuth} from 'firebase/auth'

export interface AuthContextState {
  auth: FirebaseAuth
  currentUser: undefined | null | FirebaseUser
  setCurrentUser: React.Dispatch<React.SetStateAction<undefined | null | FirebaseUser>>
}

export interface AuthProviderProps {
  children: React.ReactNode
}
