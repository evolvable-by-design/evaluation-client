import React from 'react'
import { Link } from 'react-router-dom'
import { Button, Pane, Text, majorScale } from 'evergreen-ui'

import AuthenticationService from '../services/AuthenticationService'

function Header({ width }) {
  return (
    <Pane width={ width || majorScale(9) } background='#0747A6'>
      <Text color='white'>This is the header</Text>
      { !AuthenticationService.isAuthenticated() && <Link to="/login"><Button>Login</Button></Link> }
    </Pane>
  );
}

export default Header
