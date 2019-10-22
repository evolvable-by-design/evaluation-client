import React, { useEffect } from 'react';

import FullscreenLoader from '../components/FullscreenLoader';
import FullscreenError from '../components/FullscreenError';

import { useAppContextDispatch, useAppContextState } from '../context/AppContext';
import useApiDocumentation from '../../library/hooks/useApiDocumentation';
import AuthenticationService from '../../library/services/AuthenticationService';

import Config from '../../config';

const App = ({children}) => {
  const [documentation, isLoading, error] = useApiDocumentation(Config.serverUrl);
  const contextDispatch = useAppContextDispatch();

  useEffect(
    () => contextDispatch({ type: 'updateDocumentation', documentation }),
    [documentation, contextDispatch]
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
