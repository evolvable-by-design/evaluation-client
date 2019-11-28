import React, { useState } from 'react';
import { Alert, Button, Dialog, Heading, Spinner, majorScale } from 'evergreen-ui'

import GenericAction from './GenericAction'
import { capitalize, spaceCamelCaseWord } from '../../app/utils/javascriptUtils'

const GenericActionInDialog = ({ label, alwaysShown, successMessage, actionKey, operation, buttonAppearance, onSuccessCallback, onErrorCallback }) => {
  const [isShown, setIsShown] = useState(false)

  return <GenericAction
    actionKey={actionKey}
    operation={operation}
    MainComponent={MainComponent(label, successMessage, alwaysShown, buttonAppearance, isShown, setIsShown)}
    onSuccessCallback={onSuccessCallback}
    onErrorCallback={onErrorCallback}
  />
}

const MainComponent = (label, successMessage, alwaysShown, buttonAppearance, isShown, setIsShown) => ({isLoading, success, error, triggerCall, filtersToDisplay, formToDisplay, operation}) => {
  const operationKey = operation.operationId;

  return <>
    <Dialog
      isShown={alwaysShown === true || isShown}
      title={operation.summary}
      isConfirmLoading={isLoading}
      onConfirm={triggerCall}
      onCloseComplete={() => setIsShown(false)}
      confirmLabel={isLoading ? 'Loading...' : 'Go!'}
    >
      {
        isLoading ? <Spinner />
        : success ? <Heading>{ successMessage || 'Success!' }</Heading>
        : <>
            {filtersToDisplay}
            {formToDisplay}
            { error && <Alert intent="danger" title={error.message || error} /> }
          </>
      }
    </Dialog>
    { !(alwaysShown === true) && <Button appearance={buttonAppearance || "default"} marginRight={majorScale(2)} onClick={() => setIsShown(true)}>{ spaceCamelCaseWord(capitalize(label || operationKey)) }</Button> }
  </>
}

export default GenericActionInDialog;
