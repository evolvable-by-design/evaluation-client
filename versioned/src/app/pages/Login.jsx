import React, { useMemo, useState } from 'react';
import { Redirect, useHistory, useParams } from 'react-router-dom';
import { Alert, Dialog, Heading, Spinner, majorScale } from 'evergreen-ui';

import AuthenticationService from '../../library/services/AuthenticationService';
import { useOperation } from '../../library/services/ReactGenericOperation';

import FullscreenCenterContainer from '../components/FullscreenCenterContainer';
import GenericForm from '../components/GenericForm';
import Semantics from '../utils/semantics';
import { useAppContextState } from '../context/AppContext';


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
  const [loginData, setLoginData] = useState()

  if (loginData) {
    AuthenticationService.updateToken(loginData.getValue(Semantics.vnd_jeera.terms.JWT))
    return <Redirect to={redirectTo || '/'} />
  } else {
    return <LoginDialog onComplete={setLoginData} />
  }
}

const LoginDialog = ({ onComplete }) => {
  const { genericOperationBuilder } = useAppContextState()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const loginOperation = useMemo(() => genericOperationBuilder.fromKey(Semantics.vnd_jeera.actions.login), [])
  const { parametersDetail, makeCall, isLoading, success, data, error } = useOperation(loginOperation)

  if (success) {
    onComplete(data)

    return <FullscreenCenterContainer>
      <Heading width="100%" size={700} marginBottom={majorScale(2)}>You are now successfully logged in <span role='img' aria-label='byebye'>👋</span></Heading>
    </FullscreenCenterContainer>
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
        confirmLabel={isLoading ? 'Loading...' : 'Ok'}
      >
        <GenericForm {...parametersDetail} />
        { error && <Alert intent="danger" title={error.message} /> }
      </Dialog>
    </FullscreenCenterContainer>
  }
}

export default Login;
