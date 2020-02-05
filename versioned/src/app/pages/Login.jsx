import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Alert, Dialog, Heading, Pane, Spinner, TextInput, majorScale } from 'evergreen-ui';

import AuthenticationService from '../services/AuthenticationService';

import FullscreenCenterContainer from '../components/layout/FullscreenCenterContainer';
import WithLabel from '../components/input/WithLabel';
import useFetch from '../hooks/useFetch';


function Login() {
  if (AuthenticationService.isAuthenticated()) {
    return <AlreadyLoggedIn />
  } else {
    return <LoginComponent />
  }
};

const AlreadyLoggedIn = () => {
  const history = useHistory();
  setTimeout(() => history.push('/'), 1000);

  return (
    <FullscreenCenterContainer>
      <Heading size={600}>You are already logged-in. Redirecting to home...</Heading>
      <Spinner />
    </FullscreenCenterContainer>
  )
}

const LoginComponent = () => {
  const redirectTo = new URLSearchParams(window.location.search).get('redirectTo')
  const [ success, setSuccess ] = useState(false)
  const history = useHistory();

  if (success) {
    setTimeout(() => history.push(redirectTo || '/'), 1000);
    return <FullscreenCenterContainer>
      <Heading width="100%" size={700} marginBottom={majorScale(2)}>You are now successfully logged in <span role='img' aria-label='byebye'>👋</span></Heading>
    </FullscreenCenterContainer>
  } else {
    return <LoginDialog onComplete={() => setSuccess(true)} />
  }
}

const LoginDialog = ({ onComplete }) => {
  const [ username, setUsername ] = useState()
  const [ password, setPassword ] = useState()
  const { makeCall, isLoading, success, error } = useFetch(() => AuthenticationService.login(username, password))

  if (success) {
    onComplete()
    return <></>
  } else {
    return <FullscreenCenterContainer>
      <Dialog
        isShown={true}
        title={'Login'}
        hasCancel={false}
        hasClose={false}
        shouldCloseOnOverlayClick={false}
        shouldCloseOnEscapePress={false}
        isConfirmLoading={isLoading}
        onConfirm={makeCall}
        confirmLabel={isLoading ? 'Loading...' : 'Login'}
        isConfirmDisabled={username === undefined || password === undefined}
      >
        <Pane width="100%" display="flex" flexDirection="row" flexWrap="wrap" alignItems="flex-start" justifyContent="flex-start">

          <Pane width="100%" >
            <WithLabel label='Username' required>
              <TextInput
                value={username || ''}
                width="100%"
                type='text'
                onChange={e => setUsername(e.target.value)}
              />
            </WithLabel>
          </Pane>

          <Pane width="100%" >
            <WithLabel label='Password' required>
              <TextInput
                value={password || ''}
                width="100%"
                type='password'
                onChange={e => setPassword(e.target.value)}
              />
            </WithLabel>
          </Pane>

        </Pane>
        { error && <Alert intent="danger" title={error.message} /> }
      </Dialog>
    </FullscreenCenterContainer>
  }
}

export default Login;
