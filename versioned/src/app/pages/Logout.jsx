import React from 'react';
import { useHistory, Redirect } from 'react-router-dom';
import { Heading, Spinner, Paragraph, Pane, majorScale } from 'evergreen-ui';

import AuthenticationService from '../services/AuthenticationService';
import FullscreenCenterContainer from '../components/layout/FullscreenCenterContainer';
import FullscreenError from '../components/basis/FullscreenError';
import useFetch from '../hooks/useFetch';

function Logout() {
  if (!AuthenticationService.isAuthenticated()) {
    return <Redirect to="/" />
  }
  
  return <FullscreenCenterContainer><LogoutDialog /></FullscreenCenterContainer>
};

const LogoutDialog = () => {
  const history = useHistory();
  const { makeCall, isLoading, success, data, error } = useFetch(() => AuthenticationService.logout())

  if (isLoading) {
    return <Loading />
  } else if (error) {
    return <FullscreenError error={error}/>
  } else if (success) {
    setTimeout(() => history.push('/'), 1000);
    return <Success data={data}/>
  } else {
    makeCall()
    return (<>
      <Heading width="100%" size={700} marginBottom={majorScale(2)}>We are logging you out...</Heading>
      { error && <Paragraph width="100%" size={500}>{error}</Paragraph> }
    </>)
  }
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

export default Logout;
