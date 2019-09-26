import React from 'react';
import { Pane, Text } from 'evergreen-ui';

import Header from '../components/Header';
import Projects from '../components/Projects';
import { useApiContext } from '../components/App';

const Home = () => {
  const apiDocumentation = useApiContext();

  return (
    <Pane display="flex" flexDirection="row" height="100vh" width="100vw">
      <Header/>
      <Pane width="100%" elevation={4}>
        <Text>Hello there.</Text>
        <Projects />
      </Pane>
    </Pane>
  );
};

export default Home;
