import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  User as FirebaseUser
} from 'firebase/auth'

import {useAuthContext} from '../contexts/auth/useAuthContext'

export const useVerifyUser = () => {
  const {currentUser} = useAuthContext()

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
