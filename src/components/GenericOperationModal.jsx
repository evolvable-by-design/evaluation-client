import React, {useState} from 'react';

import { Alert, Button, Dialog, Pane, majorScale } from 'evergreen-ui';

import { useGenericOperationResolverOperation } from '../hooks/useGenericOperationResolver';
import { capitalize, spaceCamelCaseWord, onlyWhen } from '../utils/javascriptUtils';

const GenericOperationModal = ({label, operation, buttonAppearance}) =>  {
  const [isShown, setIsShown] = useState(false);
  const [operationKey, operationSchema] = operation;

  const [ semanticData, isLoading, error, triggerCall, filtersToDisplay, formToDisplay ] =
    useGenericOperationResolverOperation(operationSchema);

  return (<Pane marginBottom={majorScale(3)}>
    <Dialog
      isShown={isShown}
      title={operationSchema.summary}
      onCloseComplete={() => setIsShown(false)}
      isConfirmLoading={isLoading}
      onConfirm={triggerCall}
      confirmLabel={isLoading ? 'Loading...' : 'Ok'}
    >
      { formToDisplay || <></> }
      { onlyWhen(error, () =>
        <Alert intent="danger" title={error} />
      )}
    </Dialog>
    <Button appearance={buttonAppearance || "default"} onClick={() => setIsShown(true)}>{ spaceCamelCaseWord(capitalize(label || operationKey)) }</Button>
  </Pane>)
}

export default GenericOperationModal;