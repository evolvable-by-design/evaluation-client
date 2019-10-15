import React from 'react';
import { toaster } from 'evergreen-ui';

import GenericAction from './GenericAction';

const GenericActionInBackground = ({ loadingMessage, successMessage, errorMessage, Component, actionKey, operation, onSuccessCallback, onErrorCallback }) => 
  <GenericAction
    actionKey={actionKey}
    operation={operation}
    Loading={<Loading message={loadingMessage} actionKey={actionKey} />}
    Success={<Success message={successMessage} actionKey={actionKey} />}
    Error={<Error message={errorMessage} actionKey={actionKey} />}
    Component={Component}
    onSuccessCallback={onSuccessCallback}
    onErrorCallback={onErrorCallback}
  />

const Loading = ({message, actionKey}) => {
  const loadingMessage = message || `Http operation ${actionKey} is loading...`
  const duration = 1000;
  const [refresh, setRefresh] = useState(true);

  toaster.info(message, { duration });

  useEffect(() => {
    if (refresh) {
      setTimeout(() => toaster.info(loadingMessage, { duration }), duration)
    }

    return () => setRefresh(false);
  })
}

const Success = ({ message, actionKey }) => {
  const successMessage = message || `Http operation ${actionKey} successfully executed :)`
  toaster.success(successMessage);
}

const Error = ({ message, error, actionKey }) => {
  const errorMessage = message || `Sadly, an error occured while executing the Http operation ${actionKey}.`
  toaster.success(errorMessage, { description: error });
}

export default GenericActionInBackground;
