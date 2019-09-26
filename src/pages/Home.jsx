import React from 'react';
import { Pane, Text } from 'evergreen-ui';

import Header from '../components/Header';
import { useApiContext } from '../components/App';

const Home = () => {
  const apiDocumentation = useApiContext();
  const apiDocLength = JSON.stringify(apiDocumentation).length;

  return (
    <Pane display="flex" flexDirection="row" height="100vh" width="100vw">
      <Header/>
      <Pane width="100%" elevation={4}>
        <Text>Hello there, api documentation is {apiDocLength} character long.</Text>
      </Pane>
    </Pane>
  );
};

export default Home;