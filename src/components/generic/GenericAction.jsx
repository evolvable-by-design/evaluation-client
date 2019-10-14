import React, { useMemo, useState } from 'react';

import useGenericOperationResolver from '../../hooks/useGenericOperationResolver';

const GenericAction = ({ Loading, Success, Component, ErrorComponent, action, onSuccessCallback, onErrorCallback }) => {
  const [ semanticData, isLoading, error, triggerCall, filtersToDisplay, formToDisplay, operation ] =
    useGenericOperationResolver(action, onSuccessCallback, onErrorCallback);

  const success = useMemo(() => !isLoading && error === undefined, [isLoading, error])

  const [callAlreadyTriggered, setCallAlreadyTriggered] = useState(operation.verb === 'get');

  if (Loading && isLoading === true) {
    return <Loading />
  } else if (Success && success) {
    return <Success data={semanticData} />
  } else if (ErrorComponent && error) {
    return <ErrorComponent error={error} />
  } else if (Component) {
    return <Component isLoading={isLoading} success={success} data={semanticData} error={error} triggerCall={triggerCall} filtersToDisplay={filtersToDisplay} formToDisplay={formToDisplay} operation={operation} />
  } else {
    if (!callAlreadyTriggered) {
      triggerCall();
      setCallAlreadyTriggered(true);
    }
    console.warn(`No component provided for <GenericAction action={${action} .../>`)
  }
}

export default GenericAction;

/*
  TODO:
    - fetch the userContext with the GenericActionInBackground component
*/
