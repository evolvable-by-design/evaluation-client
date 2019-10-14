import React from 'react';
import { toaster } from 'evergreen-ui';

import GenericAction from './GenericAction';

const GenericActionInBackground = ({ loadingMessage, successMessage, errorMessage, Component, action, onSuccessCallback, onErrorCallback }) => 
  <GenericAction
    Loading={<Loading message={loadingMessage} action={action} />}
    Success={<Success message={successMessage} action={action} />}
    Error={<Error message={errorMessage} action={action} />}
    Component={Component}
    onSuccessCallback={onSuccessCallback}
    onErrorCallback={onErrorCallback}
  />

const Loading = ({message, action}) => {
  const loadingMessage = message || `Http operation ${action} is loading...`
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

const Success = ({ message, action }) => {
  const successMessage = message || `Http operation ${action} successfully executed :)`
  toaster.success(successMessage);
}

const Error = ({ message, error, action }) => {
  const errorMessage = message || `Sadly, an error occured while executing the Http operation ${action}.`
  toaster.success(errorMessage, { description: error });
}

export default GenericActionInBackground;
