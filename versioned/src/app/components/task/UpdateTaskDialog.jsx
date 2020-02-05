import React, { useEffect, useState } from 'react'
import { Alert, Dialog, Pane, Textarea, TextInput } from 'evergreen-ui' 

import useFetch from '../../hooks/useFetch'
import TaskService from '../../services/TaskService'
import SelectInput from '../input/SelectInput'
import WithLabel from '../input/WithLabel'

const UpdateTaskDialog = ({ task, isShown, onSuccessCallback, onCloseComplete }) => {
  const [ name, setName ] = useState(task.name)
  const [ description, setDescription ] = useState(task.description)
  const [ assignee, setAssignee ] = useState(task.assignee)
  const [ status, setStatus ] = useState(task.status)
  const [ points, setPoints ] = useState(task.points)
  const { makeCall, isLoading, success, data, error } = useFetch(() => TaskService.update(task.projectId, {...task, name, description, assignee, status, points}))

  useEffect(() => {
    if (success && data) { 
      onSuccessCallback()
      onCloseComplete()
    }
  }, [success, data])

  return <Dialog
    isShown={isShown}
    title='Update task'
    isConfirmLoading={isLoading}
    isConfirmDisabled={ { ...task, name, description, assignee, status, points } == task }
    confirmLabel="Update"
    onConfirm={makeCall}
    onCloseComplete={() => { if (success) { onSuccessCallback(data) } onCloseComplete() }}
    hasFooter={!success}
    width="700px"
  >
    <div>
      { !(success && data) && 
        <>
          <Pane width="100%" display="flex" flexDirection="row" flexWrap="wrap" alignItems="flex-start" justifyContent="flex-start">

            <Pane width="100%" >
              <WithLabel label='Name'>
                <TextInput
                  isInvalid={name.length < 3 || name.length > 140}
                  value={name || ''}
                  type='text'
                  width="100%"
                  onChange={e => setName(e.target.value)}
                />
              </WithLabel>
            </Pane>

            <Pane width="100%" >
              <WithLabel label='Assignee'>
                <TextInput
                  value={assignee || ''}
                  width="100%"
                  type='text'
                  onChange={e => setAssignee(e.target.value)}
                />
              </WithLabel>
            </Pane>

            <Pane width="100%" >
              <WithLabel label='Description'>
                <Textarea
                  isInvalid={description.length > 2000}
                  validationMessage={description.length > 2000 ? 'Max length is 2000' : undefined}
                  value={description || ''}
                  width="100%"
                  onChange={e => setDescription(e.target.value)}
                />
              </WithLabel>
            </Pane>

            <Pane width="100%" >
              <WithLabel label='Status'>
                <SelectInput 
                  options={Array.from(new Set([ 'todo', 'in progress', 'review', task.status]))}
                  value={status}
                  onChange={e => setStatus(e.target.value)}
                  required={false}
                />
              </WithLabel>
            </Pane>

            { task.points && 
              <Pane width="100%" >
                <WithLabel label='Points'>
                <TextInput
                  isInvalid={points < 0}
                  validationMessage={points < 0 ? 'Can only be a positive number' : undefined}
                  value={points}
                  type='number'
                  width="100%"
                  onChange={e => setPoints(e.target.value)}
                />
                </WithLabel>
              </Pane>
            }
            
          </Pane>
        </>
      }
      { error && <Alert intent="danger" title={error.message || error} marginBottom='16px' /> }
    </div>
  </Dialog>
}

export default UpdateTaskDialog