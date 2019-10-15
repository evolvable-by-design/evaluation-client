import React, { useMemo, useState } from 'react';

import useGenericOperationResolver from '../../hooks/useGenericOperationResolver';

const GenericAction = ({ Loading, Success, MainComponent, ErrorComponent, actionKey, operation, onSuccessCallback, onErrorCallback }) => {
  const [ semanticData, isLoading, error, triggerCall, filtersToDisplay, formToDisplay, trigerredOperation ] =
    useGenericOperationResolver(actionKey, operation, onSuccessCallback, onErrorCallback);

  const [callAlreadyTriggered, setCallAlreadyTriggered] = useState(trigerredOperation.verb === 'get');
  const success = useMemo(() => semanticData !== undefined || (callAlreadyTriggered && !isLoading && error === undefined), [callAlreadyTriggered, isLoading, error, semanticData])

  if (Loading && isLoading === true) {
    return Loading
  } else if (Success && success) {
    return <Success data={semanticData} />
  } else if (ErrorComponent && error) {
    return <ErrorComponent error={error} />
  } else if (MainComponent) {
    return <MainComponent isLoading={isLoading} success={success} data={semanticData} error={error} triggerCall={() => { setCallAlreadyTriggered(true); triggerCall(); }} filtersToDisplay={filtersToDisplay} formToDisplay={formToDisplay} operation={operation} />
  } else {
    if (!callAlreadyTriggered) {
      triggerCall();
      setCallAlreadyTriggered(true);
    }
    
    return null;
  }
}

export default GenericAction;
