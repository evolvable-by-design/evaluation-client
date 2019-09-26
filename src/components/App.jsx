import React, { useContext } from 'react';

import { Text } from 'evergreen-ui';

import FullscreenLoader from '../components/FullscreenLoader';

import useApiDocumentation from '../hooks/useApiDocumentation';

const ApiContext = React.createContext(undefined);
export const useApiContext = () => {
  const documentation = useContext(ApiContext);
  
  if (documentation === undefined) {
    throw new Error('useApiContext must be used within App');
  }
  return documentation;
};

const App = ({children}) => {
  const [documentation, isLoading, error] = useApiDocumentation();

  if (isLoading) {
    return <FullscreenLoader />
  } else if (error) {
    return <Text>{error}</Text>
  } else {
    return <>
      <ApiContext.Provider value={documentation} >
        {children}
      </ApiContext.Provider>
    </>;
  }
};

export default App;
