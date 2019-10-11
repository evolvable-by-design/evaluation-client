import React, { useState, useCallback } from 'react';
import { useHistory, Redirect } from 'react-router-dom';
import { Heading, Spinner, Paragraph, Pane, majorScale } from 'evergreen-ui';

import FullscreenCenterContainer from '../components/FullscreenCenterContainer';
import useGenericOperationResolver from '../hooks/useGenericOperationResolver';
import AuthenticationService from '../services/AuthenticationService';
import Semantics from '../utils/semantics';

function Logout() {
  if (!AuthenticationService.isAuthenticated()) {
    return <Redirect to="/login" />
  }
  
  return <LogoutDialog />
};

const LogoutDialog = () => {
  const history = useHistory();
  const [success, setSuccess] = useState(false);

  const callback = useCallback(() => {
    setSuccess(true);
    AuthenticationService.removeToken();
  }, []);

  const [ semanticData, isLoading, error, triggerCall, filtersToDisplay, formToDisplay ] =
    useGenericOperationResolver(Semantics.vnd_jeera.actions.logout, callback);

  if (isLoading === true) {
    return <LoggingOutInProgress />
  } else if (success) {
    setTimeout(() => history.push('/login'), 2000)
    return <SuccessfullyLoggedOut data={semanticData}/>
  } else if (filtersToDisplay || formToDisplay) {
    return <LogoutWithInput error={error} triggerCall={triggerCall} filtersToDisplay={filtersToDisplay} formToDisplay={formToDisplay} />
  } else {
    if (triggerCall === undefined) setTimeout(() => callback(), 1000);
    return <LogoutWithoutInput error={error} triggerCall={triggerCall} />
  }
}

const LoggingOutInProgress = () =>
  <FullscreenCenterContainer>
    <Heading width="100%" size={700} marginBottom={majorScale(2)}>Logging you out...</Heading>
    <Pane><Spinner marginX="auto"/></Pane>
  </FullscreenCenterContainer>

const SuccessfullyLoggedOut = ({ data }) =>
  <FullscreenCenterContainer>
    <Heading width="100%" size={700} marginBottom={majorScale(2)}>You were successfully logged out <span role='img' aria-label='byebye'>👋</span></Heading>
    <Paragraph>We will redirect you to the login page very soon.</Paragraph>
    { data && <Paragraph>{JSON.stringify(data.data)}</Paragraph> }
  </FullscreenCenterContainer>

const LogoutWithoutInput = ({ error, triggerCall }) => {
  if (triggerCall !== undefined) triggerCall();

  return (<FullscreenCenterContainer>
    <Heading width="100%" size={700} marginBottom={majorScale(2)}>We are logging you out...</Heading>
    { error && <Paragraph width="100%" size={500}>{error}</Paragraph> }
  </FullscreenCenterContainer>)
}

const LogoutWithInput = () => <Heading>Not yet supported</Heading>

export default Logout;
