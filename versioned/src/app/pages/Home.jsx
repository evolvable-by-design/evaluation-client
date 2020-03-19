import React from 'react';

import BaseApplicationLayout from '../components/layout/BaseApplicationLayout'
import LoginRedirect from '../components/basis/LoginRedirect'
import Projects from '../components/project/Projects';
import AuthenticationService from '../services/AuthenticationService'

const Home = () => {
  if (!AuthenticationService.isAuthenticated()) {
    return <LoginRedirect />
  } else {
    return <BaseApplicationLayout>
      <Projects/>
    </BaseApplicationLayout>
  }
}

export default Home;
