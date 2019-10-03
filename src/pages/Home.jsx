import React from 'react';
import { Pane } from 'evergreen-ui';

import Header from '../components/Header';
import Projects from '../components/Projects';
import majorScale from 'evergreen-ui/commonjs/scales/src/majorScale';

const Home = () =>
  <Pane display="flex" flexDirection="row" height="100vh" width="100vw" overflow="hidden">
    <Header/>
    <Pane width="100%" height="100%" overflow="scroll"
      elevation={4}
      paddingX={majorScale(10)}
      paddingY={majorScale(5)}>
      <Projects />
    </Pane>
  </Pane>

export default Home;
