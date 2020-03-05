import React, { useEffect } from 'react'
import { Alert, Dialog } from 'evergreen-ui' 

import { useOperation } from '../../library/services/ReactGenericOperation'
import ComponentResolver from '../../library/services/ComponentResolver'

import GenericForm from './GenericForm'
import { capitalize, spaceCamelCaseWord } from '../utils/javascriptUtils'
import { useAppContextState } from '../context/AppContext'

const ActionDialog = ({ isShown, title, operationSchema, onSuccessCallback, onCloseComplete }) => {
  const { genericOperationBuilder } = useAppContextState()
  const operation = genericOperationBuilder.fromOperation(operationSchema)
  const { parametersDetail, makeCall, isLoading, data, error, success } = useOperation(operation)

  useEffect(() => {
    if (success && !data) { 
      onSuccessCallback()
      onCloseComplete()
    }
  }, [success])

  return <Dialog
    isShown={isShown !== undefined ? isShown : true}
    title={capitalize(spaceCamelCaseWord(title))}
    isConfirmLoading={isLoading}
    confirmLabel="Confirm"
    onConfirm={makeCall}
    onCloseComplete={() => { if (success) { onSuccessCallback(data) } onCloseComplete() }}
    hasHeader={!(success && data)}
    hasFooter={!success}
    width="auto"
  >
    <div style={{ 'minWidth': '560px' }}>
      { !(success && data) && <GenericForm {...parametersDetail} /> }
      { error && <Alert intent="danger" title={error.message || error} marginBottom='16px' /> }
      { success && !data && <Alert intent="success" title='Success' marginBottom='16px' /> }
      { success && data && <ComponentResolver semanticData={data} /> }
    </div>
  </Dialog>
}

export default ActionDialog