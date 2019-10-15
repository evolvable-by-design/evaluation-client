import React, { useEffect } from 'react';
import { toaster } from 'evergreen-ui';

import GenericAction from './GenericAction';

const GenericActionInBackground = ({ loadingMessage, successMessage, errorMessage, MainComponent, actionKey, operation, onSuccessCallback, onErrorCallback }) =>
  <GenericAction
    actionKey={actionKey}
    operation={operation}
    Loading={Loading({message: loadingMessage, actionKey})}
    Success={Success({message: successMessage, actionKey})}
    Error={ErrorComponent({message: errorMessage, actionKey})}
    MainComponent={MainComponent}
    onSuccessCallback={onSuccessCallback}
    onErrorCallback={onErrorCallback}
  />

const Loading = ({message, actionKey}) => {
  const loadingMessage = message || `Http operation ${actionKey} is loading...`
  const duration = 1; // second
  
  const notify = () => toaster.notify(loadingMessage, { duration, id: actionKey });
  useEffect(() => {
    const interval = setInterval(notify, duration*1000)
    return () => clearInterval(interval)
  }, [])
  
  return null;
}

const Success = ({message, actionKey}) => ({data}) => {
  const successMessage = message || `Http operation ${actionKey} successfully executed :)`
  toaster.success(successMessage);
  return null;
}

const ErrorComponent = ({message, actionKey}) => ({ error }) => {
  const errorMessage = message || `Sadly, an error occured while executing the Http operation ${actionKey}.`
  toaster.success(errorMessage, { description: error });
  return null;
}

export default GenericActionInBackground;
