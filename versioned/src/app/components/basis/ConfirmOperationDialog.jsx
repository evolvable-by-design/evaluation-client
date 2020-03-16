import React, { useCallback, useState } from 'react'
import { Dialog, Text, toaster } from 'evergreen-ui' 

const ConfirmOperationDialog = ({ operation, title, onSuccessCallback, onCloseComplete, intent }) => {
  const [ isLoading, setIsLoading ] = useState(false)
  const operationTrigger = useCallback(() => {
    setIsLoading(true)
    operation()
      .then(() => {
        toaster.success(`Successfully executed ${title}!`)
        if (onSuccessCallback) { onSuccessCallback(); }
      })
      .catch(error => toaster.danger(`An error occured while trying to ${title}: ${error.message}`))
      .finally(() => setIsLoading(false))
  }, [operation, title, onSuccessCallback])

  return <Dialog
    isShown={true}
    title={title}
    confirmLabel="Confirm"
    isConfirmLoading={isLoading}
    onConfirm={operationTrigger}
    onCloseComplete={onCloseComplete}
    width="auto"
    intent={intent}
  >
    <Text>Are you sure that you want to {title}?</Text>
  </Dialog>
}

export default ConfirmOperationDialog