import { useEffect } from 'react'

import AuthenticationService from '../services/AuthenticationService'
import UserService from '../services/UserService'
import { useAppContextDispatch } from '../context/AppContext'

function useUserDetailsFetcher() {
  const contextDispatch = useAppContextDispatch()

  useEffect(() => {
    if (AuthenticationService.isAuthenticated()) {
      UserService
        .fetchCurrentUserProfile()
        .then(userProfile => contextDispatch({ type: 'updateUserProfile', userProfile }))
    }
  }, [contextDispatch])
}

export default useUserDetailsFetcher