import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom' 

import FullscreenLoader from '../components/FullscreenLoader'
import FullscreenError from '../components/FullscreenError'
import Semantics from '../utils/semantics'

import { useAppContextDispatch, useAppContextState } from '../context/AppContext'
import AuthenticationService from '../../library/services/AuthenticationService'
import DocumentationBrowser from '../../library/services/DocumentationBrowser'
import HttpCaller from '../../library/services/HttpCaller'

import Config from '../../config';

const AppProxy = ({children}) => {
  const [documentation, isLoading, error] = useApiDocumentation(Config.serverUrl)
  const contextDispatch = useAppContextDispatch()

  useEffect(
    () => { if (documentation) contextDispatch({ type: 'updateDocumentation', documentation }) },
    [documentation, contextDispatch]
  )

  if (error) {
    return <FullscreenError error={error}/>
  } else if (isLoading) {
    return <FullscreenLoader />
  } else {
    return <Application>{children}</Application>
  }
}

const Application = ({children}) => {
  const history = useHistory()
  const contextDispatch = useAppContextDispatch()

  useEffect(() => contextDispatch({ type: 'setHistory', history}), [contextDispatch, history])
  useUserDetails()
  return children
}

function useUserDetails() {
  const { userProfile, genericOperationBuilder } = useAppContextState()
  const contextDispatch = useAppContextDispatch()

  useEffect(() => {
    if (genericOperationBuilder && userProfile === undefined && AuthenticationService.isAuthenticated()) {
      genericOperationBuilder
        .fromKey(Semantics.vnd_jeera.actions.getCurrentUserDetails)
        .call()
        .then(userProfile => contextDispatch({ type: 'updateUserProfile', userProfile }))
    }
  }, [])
}

const useApiDocumentation = (serverUrl) => {
  const [documentation, setDocumentation] = useState(undefined)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(undefined)

  useEffect(() => {
    setIsLoading(true)

    new HttpCaller(serverUrl)
      .call({ method: 'options' })
      .then(result => new DocumentationBrowser(result.data))
      .then(setDocumentation)
      .catch(setError)
      .finally(() => setIsLoading(false))
  }, []);

  return [documentation, isLoading, error]
}

export default AppProxy
