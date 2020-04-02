import React, { useEffect, useState } from 'react'
import { Alert, Dialog, Pane, Textarea, TextInput } from 'evergreen-ui' 

import useFetch from '../../hooks/useFetch'
import TaskService from '../../services/TaskService'
import ArrayInput from '../input/ArrayInput'
import SelectInput from '../input/SelectInput'
import WithLabel from '../input/WithLabel'

const UpdateTaskDialog = ({ task, isShown, onSuccessCallback, onCloseComplete }) => {
  const [ title, setTitle ] = useState(task.title)
  const [ description, setDescription ] = useState(task.description)
  const [ assignee, setAssignee ] = useState(task.assignee)
  const [ status, setStatus ] = useState(task.status)
  const [ points, setPoints ] = useState(task.points)
  const [ tags, setTags ] = useState(task.tags || [])
  const [ priority, setPriority ] = useState(task.priority)
  const { makeCall, isLoading, success, data, error } = useFetch(() => TaskService.update({...task, title, description, assignee, status, points, tags, priority}))

  useEffect(() => {
    if (success && data) { 
      onSuccessCallback()
      onCloseComplete()
    }
  }, [success, data, onSuccessCallback, onCloseComplete])

  return <Dialog
    isShown={isShown}
    title='Update task'
    isConfirmLoading={isLoading}
    // eslint-disable-next-line eqeqeq
    isConfirmDisabled={ { ...task, title, description, assignee, status, points, tags, priority } == task }
    confirmLabel="Update"
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
              <WithLabel label='Title'>
                <TextInput
                  isInvalid={title.length < 4 || title.length > 80}
                  value={title || ''}
                  type='text'
                  width="100%"
                  onChange={e => setTitle(e.target.value)}
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
                  isInvalid={description.length > 4000}
                  validationMessage={description.length > 4000 ? 'Max length is 4000' : undefined}
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
                  isInvalid={points < 0 || points > 120}
                  validationMessage={points < 0 ? 'Can only be a positive number' : points > 120 ? 'Must be inferior to 120' : undefined}
                  value={points}
                  type='number'
                  width="100%"
                  onChange={e => setPoints(e.target.value)}
                />
                </WithLabel>
              </Pane>
            }

            <Pane width="100%" >
              <WithLabel label='Tags'>
                <ArrayInput 
                  values={tags}
                  setValues={setTags}
                  minItems={0}
                  maxItems={10}
                  input={({value, setValue, required}) =>
                    <TextInput value={value} type='text' width="100%" onChange={e => setValue(e.target.value)} required={required} />
                  }
                />
              </WithLabel> 
            </Pane>

            <Pane width="100%" >
              <WithLabel label='Priority'>
                <SelectInput 
                  options={Array.from(new Set([ 'blocking', 'critical', 'important', 'high', 'medium', 'low', 'simple' ]))}
                  value={priority}
                  onChange={e => setPriority(e.target.value)}
                  required={false}
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

export default UpdateTaskDialog