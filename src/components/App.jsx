import React, { useEffect, useState } from 'react';

import FullscreenLoader from '../components/FullscreenLoader';
import FullscreenError from '../components/FullscreenError';

import { useAppContextDispatch, useAppContextState } from '../context/AppContext';
import ApiDocumentationFetcher from '../services/ApiDocumentationFetcher';
import AuthenticationService from '../services/AuthenticationService';

const useApiDocumentation = () => {
  const [documentation, setDocumentation] = useState(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(undefined);

  useEffect(() => { ApiDocumentationFetcher.fetch(setDocumentation, setIsLoading, setError) }, [setDocumentation, setIsLoading, setError]);

  return [documentation, isLoading, error];
}

const App = ({children}) => {
  const [documentation, isLoading, error] = useApiDocumentation();
  const contextDispatch = useAppContextDispatch();

  useEffect(
    () => contextDispatch({ type: 'updateDocumentation', documentation }),
    [documentation]
  )

  if (isLoading) {
    return <FullscreenLoader />
  } else if (error) {
    return <FullscreenError error={error}/>
  } else {
    return <>
        <UserDetailsFetcher />  
        {children}
      </>
  }
};

const UserDetailsFetcher = () => {
  const { userProfile } = useAppContextState();
  const contextDispatch = useAppContextDispatch();

  if (userProfile === undefined && AuthenticationService.isAuthenticated()) {
    return AuthenticationService.fetchCurrentUserDetails((userProfile) =>
      contextDispatch({ type: 'updateUserProfile', userProfile })
    )
  } else {
    return null;
  }
}

export default App;
