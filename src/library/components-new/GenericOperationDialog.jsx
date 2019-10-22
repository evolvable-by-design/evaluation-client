import React, { useState } from 'react';
import { Alert, Dialog } from 'evergreen-ui';

import FullscreenCenterContainer from '../../app/components/FullscreenCenterContainer';


const GenericOperationDialog = ({operationCaller, error, form, filters, onComplete, options}) => {
  const [ formErrors, setFormErrors ] = useState({})
  const [ parametersErrors, setParametersErrors ] = useState({})
  const operation = operationCaller.useOperation()
  const { makeCall, isLoading, success, data, parameters, setParameters, formValues, setFormValues } = operation

  const actualError = error || operation['error']

  if (success) {
    onComplete(data)
  }

  return (
    <FullscreenCenterContainer>
      <Dialog
        isShown={!success}
        title={'We need you'}
        hasCancel={options['hasCancel'] || false}
        hasClose={options['hasClose'] || false}
        shouldCloseOnOverlayClick={options['shouldCloseOnOverlayClick'] || false}
        shouldCloseOnEscapePress={options['shouldCloseOnEscapePress'] || false}
        isConfirmLoading={isLoading}
        onConfirm={makeCall}
        confirmLabel={isLoading ? 'Loading...' : 'Ok'}
      >
        { (filters && filters(parameters, setParameters, parametersErrors, setParametersErrors)) || null }
        { (form && form(formValues, setFormValues, formErrors, setFormErrors)) || null }
        { error && <Alert intent="danger" title={actualError} /> }
      </Dialog>
    </FullscreenCenterContainer>)
}

export default GenericOperationDialog