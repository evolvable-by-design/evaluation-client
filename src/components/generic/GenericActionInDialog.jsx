import React from 'react';
import { Dialog, Heading, Pane, Spinner } from 'evergreen-ui';

import GenericAction from './GenericAction';

const GenericActionInDialog = ({ alwaysShown, successMessage, action, onSuccessCallback, onErrorCallback }) => 
  <GenericAction
    action={action}
    Component={Component(successMessage, alwaysShown)}
    onSuccessCallback={onSuccessCallback}
    onErrorCallback={onErrorCallback}
  />

const Component = (successMessage, alwaysShown) => ({isLoading, success, error, triggerCall, filtersToDisplay, formToDisplay, operation}) => {
  const [isShown, setIsShown] = useState(true)

  return (<Pane>
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
              { error && <Alert intent="danger" title={error} /> }
            </>
        }
      </Dialog>
      { !(alwaysShown === true) && <Button appearance={buttonAppearance || "default"} onClick={() => setIsShown(true)}>{ spaceCamelCaseWord(capitalize(operation.operationId)) }</Button> }
    </Pane>)
}

export default GenericActionInDialog;
