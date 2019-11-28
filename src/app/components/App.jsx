import React, { useEffect, useState } from 'react';
import { Redirect, useHistory } from 'react-router-dom' 

import FullscreenLoader from '../components/FullscreenLoader'
import FullscreenError from '../components/FullscreenError'
import Semantics from '../utils/semantics'
import { AuthenticationRequiredError } from '../utils/Errors'

import { useAppContextDispatch, useAppContextState } from '../context/AppContext'
import AuthenticationService from '../../library/services/AuthenticationService'
import DocumentationBrowser from '../../library/services/DocumentationBrowser'
import HttpCaller from '../../library/services/HttpCaller'

import Config from '../../config';

const AppProxy = ({children}) => {
  const contextDispatch = useAppContextDispatch()

  const [documentation, isLoading, error] = useApiDocumentation(Config.serverUrl)
  useEffect(
    () => { if (documentation) {
      contextDispatch({ type: 'updateDocumentation', documentation })
    }},
    [documentation, contextDispatch]
  )

  const history = useHistory()
  useEffect(() => contextDispatch({ type: 'setHistory', history}), [contextDispatch, history])

  if (error) {
    return <FullscreenError error={error}/>
  } else if (isLoading) {
    return <FullscreenLoader />
  } else {
    try {
      return <Application>{children}</Application>  
    } catch (error) {
      if (error instanceof AuthenticationRequiredError) {
        return <Redirect to={`/login?redirectTo=${window.location.pathname}${window.location.search}`} />
      } else {
        return <FullscreenError error='Something unexpected happened. Please try again later.'/>
      }
    }
  }
}

const Application = ({children}) => {
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [genericOperationBuilder])
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return [documentation, isLoading, error]
}

export default AppProxy
