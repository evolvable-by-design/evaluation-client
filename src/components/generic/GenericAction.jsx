import React, { useMemo, useState } from 'react';

import useGenericOperationResolver from '../../hooks/useGenericOperationResolver';

const GenericAction = ({ Loading, Success, Component, ErrorComponent, actionKey, operation, onSuccessCallback, onErrorCallback }) => {
  const [ semanticData, isLoading, error, triggerCall, filtersToDisplay, formToDisplay, trigerredOperation ] =
    useGenericOperationResolver(actionKey, operation, onSuccessCallback, onErrorCallback);

  const [callAlreadyTriggered, setCallAlreadyTriggered] = useState(trigerredOperation.verb === 'get');
  const success = useMemo(() => callAlreadyTriggered && !isLoading && error === undefined, [callAlreadyTriggered, isLoading, error])

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
    console.warn(`No component provided for <GenericAction actionKey={${actionKey}} .../>`)
  }
}

export default GenericAction;

/*
  TODO:
    - fetch the userContext with the GenericActionInBackground component
*/
