import React from 'react';
import { useHistory, Redirect } from 'react-router-dom';
import { Heading, Spinner, Paragraph, Pane, majorScale } from 'evergreen-ui';

import AuthenticationService from '../../library/services/AuthenticationService';
import { useOperation } from '../../library/services/ReactGenericOperation';

import Semantics from '../utils/semantics';
import FullscreenCenterContainer from '../components/layout/FullscreenCenterContainer';
import FullscreenError from '../components/basis/FullscreenError';
import { useAppContextState } from '../context/AppContext'

function Logout() {
  if (!AuthenticationService.isAuthenticated()) {
    return <Redirect to="/" />
  }
  
  return <FullscreenCenterContainer><LogoutDialog /></FullscreenCenterContainer>
};

const LogoutDialog = () => {
  const history = useHistory();
  const { genericOperationBuilder } = useAppContextState()

  const logoutOperation = genericOperationBuilder.fromKey(Semantics.vnd_jeera.actions.logout)
  const { parametersDetail, makeCall, isLoading, success, data, error } = useOperation(logoutOperation)

  if (isLoading) {
    return <Loading />
  } else if (error) {
    return <FullscreenError error={error}/>
  } else if (success) {
    AuthenticationService.removeToken();
    setTimeout(() => history.push('/'), 2000);
    return <Success data={data}/>
  } else if (parametersDetail.documentation.length === 0) {
    // ({error, triggerCall, filtersToDisplay, formToDisplay})
    if (makeCall !== undefined) makeCall()
    return (<>
      <Heading width="100%" size={700} marginBottom={majorScale(2)}>We are logging you out...</Heading>
      { error && <Paragraph width="100%" size={500}>{error.getValue(Semantics.schema.terms.identifier)}</Paragraph> }
    </>)
  } else {
    return <Heading>Not yet supported</Heading>
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
