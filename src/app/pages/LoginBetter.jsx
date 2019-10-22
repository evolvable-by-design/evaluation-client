import React, { useState } from 'react';
import { Redirect, useHistory, useParams } from 'react-router-dom';
import { Alert, Dialog, Heading, Spinner } from 'evergreen-ui';

import { useAppContextState } from '../context/AppContext';
import FullscreenCenterContainer from '../components/FullscreenCenterContainer';
import AuthenticationService from '../../library/services/AuthenticationService';
import Semantics from '../utils/semantics';
import useGenericOperationHandler from '../../library/hooks/useGenericOperationHandler';
import { Strategies } from '../../library/services/GenericOperationHandler'

function Login() {
  const history = useHistory();
  const { redirectTo } = useParams();
  const redirectionPath = redirectTo || "/"

  if (AuthenticationService.isAuthenticated()) {
    setTimeout(() => history.push(redirectionPath), 1000);

    return (
      <FullscreenCenterContainer>
        <Heading size={600}>You are already logged-in. Redirecting to home...</Heading>
        <Spinner />
      </FullscreenCenterContainer>
    )
  } else {
    return <LoginManager />
  }
};

const LoginManager = () => {
  const { redirectTo } = useParams();
  const redirectionPath = redirectTo || "/"
  const { apiDocumentation } = useAppContextState()
  const [ToRender, setToRender] = useState(null)
  const [error, setError] = useState()


  useGenericOperationHandler(apiDocumentation, setToRender,
    ({ executeOperation, sideEffect, show, findData }) => 
    
      executeOperation(Semantics.vnd_jeera.actions.login, Strategies.IN_COMPONENT, LoginDialog)()
        .then(sideEffect(data => AuthenticationService.updateToken(data.getValue(Semantics.vnd_jeera.terms.JWT))))
        // .then(findData('userProfile', apiDocumentation, Strategies.IN_BACKGROUND))
        // .then(sideEffect(userProfile => contextDispatch({ type: 'updateUserProfile', userProfile })))
        .then(show(Strategies.IN_COMPONENT, <Redirect to={redirectionPath} />))
        .catch(error => { console.error(error); setError(error.message); })
  )
  
  return error ? <Heading>Errror ! { error }</Heading> :
    ToRender != null ? <ToRender /> : null
}

const LoginDialog = ({operationCaller, error, form, onComplete}) => {
  const [ formErrors, setFormErrors ] = useState({})
  const operation = operationCaller.useOperation()
  const { makeCall, isLoading, success, data, formValues, setFormValues } = operation
  const actualError = findErrorMessage(error, operation['error'])

  if (success) {
    onComplete(data)
  }

  return (
    <FullscreenCenterContainer>
      <Dialog
        isShown={!success}
        title={'Login'}
        hasCancel={false}
        hasClose={false}
        shouldCloseOnOverlayClick={false}
        shouldCloseOnEscapePress={false}
        isConfirmLoading={isLoading}
        onConfirm={makeCall}
        confirmLabel={isLoading ? 'Loading...' : 'Ok'}
      >
        { form({values: formValues, setValues: setFormValues, errors: formErrors, setErrors: setFormErrors}) || <></> }
        { actualError && <Alert intent="danger" title={actualError} /> }
      </Dialog>
    </FullscreenCenterContainer>)
}

function findErrorMessage(errorFromParent, error) {
  if (errorFromParent) {
    return errorFromParent
  } else if (!error) {
    return undefined
  } else if (error.response && error.response.status === 401) {
    return 'Wrong credentials'
  } else {
    return error.message
  }
}

export default Login;
