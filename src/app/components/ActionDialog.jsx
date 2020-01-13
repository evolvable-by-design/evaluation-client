import React from 'react'
import { Alert, Button, Dialog, Heading, Pane, Spinner } from 'evergreen-ui' 

import { useOperation } from '../../library/services/ReactGenericOperation'
import ComponentResolver from '../../library/services/ComponentResolver'

import GenericForm from './GenericForm'
import { capitalize, spaceCamelCaseWord } from '../utils/javascriptUtils'
import { useAppContextState } from '../context/AppContext'

const ActionDialog = ({ isShown, title, operationSchema, onSuccessCallback, onCloseComplete }) => {
  const { genericOperationBuilder } = useAppContextState()
  const operation = genericOperationBuilder.fromOperation(operationSchema)
  const { parametersDetail, makeCall, isLoading, data, error, success } = useOperation(operation)

  return <Dialog
    isShown={isShown !== undefined ? isShown : true}
    title={capitalize(spaceCamelCaseWord(title))}
    isConfirmLoading={isLoading}
    onCloseComplete={onCloseComplete}
    hasFooter={false}
  >
    {({ close }) => <>
      <GenericForm {...parametersDetail} />
      { error && <Alert intent="danger" title={error.message || error} marginBottom='16px' /> }
      { success && !data && <Alert intent="success" title='Success' marginBottom='16px' />}
      { success && data && <><Heading size={600}>Result</Heading><ComponentResolver semanticData={data} /></>}

      <Pane display='flex' justifyContent='flex-end'>
        <Button onClick={close} marginLeft='8px'>Cancel</Button>
        { !isLoading && <Button appearance="primary" onClick={makeCall} marginLeft='8px'>Execute</Button>}
        { isLoading && <Button disabled marginLeft='8px'><Spinner size={24} /> Loading...</Button>}
        { success && <Button appearance='primary' intent='success' marginLeft='8px' onClick={() => { onSuccessCallback(data); close(); }}> Confirm</Button> }
      </Pane>
    </>}
  </Dialog>
}

export default ActionDialog