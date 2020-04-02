import React, { useEffect, useState } from 'react'
import { Alert, Dialog, Pane, TextInput } from 'evergreen-ui' 

import useFetch from '../../hooks/useFetch'
import ProjectService from '../../services/ProjectService'
import WithLabel from '../input/WithLabel'
import ArrayInput from '../input/ArrayInput'

const AddCollaboratorDialog = ({ projectId, onSuccessCallback, onCloseComplete }) => {
  const [ collaborators, setCollaborators ] = useState([])
  const { makeCall, isLoading, success, data, error } = useFetch(() => ProjectService.addCollaborator(projectId, collaborators))

  useEffect(() => {
    if (success) { 
      onSuccessCallback()
      onCloseComplete()
    }
  }, [success, onSuccessCallback, onCloseComplete])

  return <Dialog
    isShown={true}
    title='Create task'
    isConfirmLoading={isLoading}
    confirmLabel="Create"
    onConfirm={() => makeCall()}
    onCloseComplete={() => { if (success) { onSuccessCallback(data) } onCloseComplete() }}
    hasFooter={!success}
    width="700px"
  >
    <div>
      { !(success && data) && 
        <>
          <Pane width="100%" display="flex" flexDirection="row" flexWrap="wrap" alignItems="flex-start" justifyContent="flex-start">

            <Pane width="100%" >

              <WithLabel label='collaborators' required>
                <ArrayInput 
                  values={collaborators}
                  setValues={setCollaborators}
                  required
                  minItems={1}
                  maxItems={5}
                  input={({value, setValue, required}) =>
                    <TextInput value={value} type='text' width="100%" onChange={e => setValue(e.target.value)} required={required} />
                  }
                />
              </WithLabel> 
            </Pane>

          </Pane>
        </>
      }
      { error && <Alert intent="danger" title={error?.response?.data?.description || error.message || error} marginBottom='16px' /> }
    </div>
  </Dialog>
}

export default AddCollaboratorDialog
