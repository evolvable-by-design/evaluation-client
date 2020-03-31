import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import qs from 'qs'

import { useAppContextDispatch, useAppContextState } from './context/AppContext'
import Semantics from './utils/semantics'
import AuthenticationService from '../library/services/AuthenticationService'

export function useQuery() {
  return qs.parse(useLocation().search.substring(1))
}

export function useAsync(fct, dep) {
  if (!dep) {
    console.warn('useAsync was not provided a dependency array. If no dependency is needed, please provide an empty array.')
  }

  const [ data, setData ] = useState()
  const [ error, setError ] = useState()

  useEffect(() => {
    let unmounted = false

    const toExecute = async () => {
      if (fct) {
        const result = fct()

        if (result !== undefined) {
          result
            .then(result => { if (!unmounted) { setData(result) }})
            .catch(err => { if (!unmounted) { setError(err) }})
        }
      }
    }

    toExecute()

    return () => { unmounted = true }
  }, dep)

  return [ data, error ]
}

export function useUserDetailsFetcher() {
  const { genericOperationBuilder } = useAppContextState()
  const contextDispatch = useAppContextDispatch()

  useEffect(() => {
    if (genericOperationBuilder && AuthenticationService.isAuthenticated()) {
      genericOperationBuilder
        .fromKey(Semantics.vnd_jeera.actions.getCurrentUserDetails)
        .call()
        .then(userProfile => contextDispatch({ type: 'updateUserProfile', userProfile }))
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [genericOperationBuilder, contextDispatch])
}
