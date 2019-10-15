import React from 'react';
import { Redirect, useHistory, useParams } from 'react-router-dom';
import { Alert, Dialog, Heading, Spinner } from 'evergreen-ui';

import { useAppContextDispatch } from '../context/AppContext';
import FullscreenCenterContainer from '../components/FullscreenCenterContainer';
import useGenericOperationResolver from '../hooks/useGenericOperationResolver';
import AuthenticationService from '../services/AuthenticationService';
import Semantics from '../utils/semantics';

function Login() {
  const history = useHistory();

  if (AuthenticationService.isAuthenticated()) {
    setTimeout(() => history.push('/'), 1000);

    return (
      <FullscreenCenterContainer>
        <Heading size={600}>You are already logged-in. Redirecting to home...</Heading>
        <Spinner />
      </FullscreenCenterContainer>
    )
  } else {
    return <LoginDialog />
  }
};

const LoginDialog = () => {
  const { redirectTo } = useParams();
  const [ semanticData, isLoading, error, triggerCall, filtersToDisplay, formToDisplay ] =
  useGenericOperationResolver(Semantics.vnd_jeera.terms.login);
  const contextDispatch = useAppContextDispatch();

  if (semanticData !== undefined) {
    AuthenticationService.updateToken(semanticData.getValue(Semantics.vnd_jeera.terms.JWT))
    
    return <>
      {
        AuthenticationService.fetchCurrentUserDetails((userProfile) => {
          contextDispatch({ type: 'updateUserProfile', userProfile })
        })
      }
      <Redirect to={redirectTo || '/'} />
    </>
  }

  return (
    <FullscreenCenterContainer>
      <Dialog
        isShown={true}
        title={'Login'}
        hasCancel={false}
        hasClose={false}
        shouldCloseOnOverlayClick={false}
        shouldCloseOnEscapePress={false}
        isConfirmLoading={isLoading}
        onConfirm={triggerCall}
        confirmLabel={isLoading ? 'Loading...' : 'Ok'}
      >
        { formToDisplay || <></> }
        { error && <Alert intent="danger" title={error} /> }
      </Dialog>
    </FullscreenCenterContainer>)
}

export default Login;
