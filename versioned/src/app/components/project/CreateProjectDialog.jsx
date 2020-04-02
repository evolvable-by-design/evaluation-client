import React, { useEffect, useState } from 'react'
import { Alert, Dialog, Pane, TextInput } from 'evergreen-ui' 

import useFetch from '../../hooks/useFetch'
import ProjectService from '../../services/ProjectService'

import WithLabel from '../input/WithLabel'

const CreateProjectDialog = ({ isShown, onSuccessCallback, onCloseComplete }) => {
  const [ name, setName ] = useState()
  const { makeCall, isLoading, success, data, error } = useFetch(() => ProjectService.create(name))

  useEffect(() => {
    if (success && data) { 
      onSuccessCallback()
      onCloseComplete()
    }
  }, [success, data, onSuccessCallback, onCloseComplete])

  return <Dialog
    isShown={isShown}
    title='Create a project'
    isConfirmLoading={isLoading}
    confirmLabel="Create project"
    onConfirm={() => makeCall()}
    isConfirmDisabled={name === undefined}
    onCloseComplete={() => { if (success) { onSuccessCallback(data) } onCloseComplete() }}
    hasHeader={!(success && data)}
    hasFooter={!success}
    width="auto"
  >
    <div style={{ 'minWidth': '560px' }}>
      { !(success && data) && 
        <Pane width="100%" display="flex" flexDirection="row" flexWrap="wrap" alignItems="flex-start" justifyContent="flex-start">

          <Pane width="100%" >
            <WithLabel label='Name' required>
              <TextInput
                isInvalid={name && (name.length < 3 || name.length > 140)}
                value={name || ''}
                type='text'
                width="100%"
                onChange={e => setName(e.target.value)}
              />
            </WithLabel>
          </Pane>

        </Pane>
      }
      { error && <Alert intent="danger" title={error?.response?.data?.description || error.message || error} marginBottom='16px' /> }
    </div>
  </Dialog>
}

export default CreateProjectDialog