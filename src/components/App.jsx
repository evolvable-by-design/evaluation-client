import React, { useContext, useEffect, useState } from 'react';

import FullscreenLoader from '../components/FullscreenLoader';
import FullscreenError from '../components/FullscreenError';

import AuthenticationService from '../services/AuthenticationService';
import ApiDocumentationFetcher from '../services/ApiDocumentationFetcher';

const ApiContext = React.createContext(undefined);
export const useAppContext = () => {
  const context = useContext(ApiContext);

  if (context === undefined) {
    throw new Error('useAppContext must be used within App');
  }
  return context;
};

const useApiDocumentation = () => {
  const [documentation, setDocumentation] = useState(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(undefined);

  useEffect(() => { ApiDocumentationFetcher.fetch(setDocumentation, setIsLoading, setError) }, [setDocumentation, setIsLoading, setError]);

  return [documentation, isLoading, error];
}

const App = ({children}) => {
  const [documentation, isLoading, error] = useApiDocumentation()
  const authenticationService = new AuthenticationService(documentation);

  const context = {
    apiDocumentation: documentation,
    authenticationService
  }

  if (isLoading) {
    return <FullscreenLoader />
  } else if (error) {
    return <FullscreenError error={error}/>
  } else {
    return <ApiContext.Provider value={context} >
        {children}
      </ApiContext.Provider>
  }
};

export default App;
