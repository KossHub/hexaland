import React from 'react'
import {User as FirebaseUser, Auth as FirebaseAuth} from 'firebase/auth'

export interface AuthContextState {
  auth: FirebaseAuth
  currentUser: null | FirebaseUser
  setCurrentUser: React.Dispatch<React.SetStateAction<null | FirebaseUser>>
}

export interface AuthProviderProps {
  children: React.ReactNode
}
