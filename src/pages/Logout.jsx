import React from 'react';
import { useHistory, Redirect } from 'react-router-dom';
import { Heading, Spinner, Paragraph, Pane, majorScale } from 'evergreen-ui';

import GenericActionFullscreen from '../components/generic/GenericActionFullscreen';
import AuthenticationService from '../services/AuthenticationService';
import Semantics from '../utils/semantics';
import FullScreenError from '../components/FullscreenError';

function Logout() {
  if (!AuthenticationService.isAuthenticated()) {
    return <Redirect to="/" />
  }
  
  return <LogoutDialog />
};

const LogoutDialog = () => {
  const history = useHistory();

  return <GenericActionFullscreen
    actionKey={Semantics.vnd_jeera.actions.logout}
    Loading={<Loading />}
    Success={Success}
    ErrorComponent={FullScreenError}
    Component={Component}
    onSuccessCallback={() => {
      AuthenticationService.removeToken();
      setTimeout(() => history.push('/'), 2000);
    }}
  />
}

const Loading = () =>
  <>
    <Heading width="100%" size={700} marginBottom={majorScale(2)}>Logging you out...</Heading>
    <Pane><Spinner marginX="auto"/></Pane>
  </>

const Success = ({ data }) =>
  <>
    <Heading width="100%" size={700} marginBottom={majorScale(2)}>You were successfully logged out <span role='img' aria-label='byebye'>👋</span></Heading>
    <Paragraph>We will redirect you to the home page very soon.</Paragraph>
    { data && <Paragraph>{JSON.stringify(data.data)}</Paragraph> }
  </>

const Component = ({error, triggerCall, filtersToDisplay, formToDisplay}) => {
  if (!filtersToDisplay && !formToDisplay) {
    if (triggerCall !== undefined) triggerCall();
    return (<>
      <Heading width="100%" size={700} marginBottom={majorScale(2)}>We are logging you out...</Heading>
      { error && <Paragraph width="100%" size={500}>{error}</Paragraph> }
    </>)
  } else {
    return <Heading>Not yet supported</Heading>
  }
}

export default Logout;
