import React, { useContext } from 'react';

import FullscreenLoader from '../components/FullscreenLoader';
import FullscreenError from '../components/FullscreenError';

import useApiDocumentation from '../hooks/useApiDocumentation';
import AuthenticationService from '../services/AuthenticationService';

const ApiContext = React.createContext(undefined);
export const useApiContext = () => {
  const context = useContext(ApiContext);

  if (context === undefined) {
    throw new Error('useApiContext must be used within App');
  }
  return context;
};

const App = ({children}) => {
  const [documentation, isLoading, error] = useApiDocumentation();
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
    return <>
      <ApiContext.Provider value={context} >
        {children}
      </ApiContext.Provider>
    </>;
  }
};

export default App;
