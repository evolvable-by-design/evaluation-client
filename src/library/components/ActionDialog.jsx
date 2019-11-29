import React, { useEffect } from 'react'
import { Alert, Dialog } from 'evergreen-ui' 

import { useOperation } from '../services/ReactGenericOperation'
import { capitalize, spaceCamelCaseWord } from '../../app/utils/javascriptUtils'

const ActionDialog = ({ genericOperationBuilder, title, operationSchema, onSuccessCallback, onCloseComplete }) => {
  const operation = genericOperationBuilder.fromOperation(operationSchema)
  const { form, filters, makeCall, isLoading, data, error, success } = useOperation(operation)

  useEffect(() => { if (success) { onSuccessCallback(data) } }, [success])

  return <Dialog
    isShown={true}
    title={capitalize(spaceCamelCaseWord(title))}
    confirmLabel="Confirm"
    isConfirmLoading={isLoading}
    onConfirm={makeCall}
    onCloseComplete={onCloseComplete}
  >
    { filters }
    { form }
    { error && <Alert intent="danger" title={error.message || error} /> }
  </Dialog>
}

export default ActionDialog