import {useContext} from 'react'
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  User as FirebaseUser
} from 'firebase/auth'
import {AuthContext} from '../contexts/auth'

export const useVerifyUser = () => {
  const {currentUser} = useContext(AuthContext)

  return async (password: string) => {
    const credentials = EmailAuthProvider.credential(
      currentUser!.email as string,
      password
    )

    try {
      await reauthenticateWithCredential(
        currentUser as FirebaseUser,
        credentials
      )
      return true
    } catch {
      return false
    }
  }
}
