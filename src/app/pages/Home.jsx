import React from 'react';
import { Pane } from 'evergreen-ui';

import BaseApplicationLayout from '../components/BaseApplicationLayout'
import Header from '../components/Header';
import Projects from '../components/Projects';
import majorScale from 'evergreen-ui/commonjs/scales/src/majorScale';

const Home = () =>
  <BaseApplicationLayout>
    <Projects/>
  </BaseApplicationLayout>

export default Home;
