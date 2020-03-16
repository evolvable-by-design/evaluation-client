import React, { useEffect, useState } from 'react'
import { Alert, Dialog, Pane, Textarea, TextInput } from 'evergreen-ui' 

import useFetch from '../../hooks/useFetch'
import { TaskTypes } from '../../domain/Task'
import TaskService from '../../services/TaskService'
import ArrayInput from '../input/ArrayInput'
import SelectInput from '../input/SelectInput'
import WithLabel from '../input/WithLabel'

const TaskCreationDialog = ({ projectId, onSuccessCallback, onCloseComplete, type }) => {
  const [ title, setTitle ] = useState()
  const [ description, setDescription ] = useState()
  const [ assignee, setAssignee ] = useState()
  const [ points, setPoints ] = useState()
  const [ status, setStatus ] = useState()
  const [ priority, setPriority ] = useState()
  const [ tags, setTags ] = useState([])
  const { makeCall, isLoading, success, data, error } = useFetch(() => TaskService.create(projectId, type, {title, description, assignee, points, tags, priority }))

  useEffect(() => {
    if (success && data) { 
      onSuccessCallback()
      onCloseComplete()
    }
  }, [success, data, onSuccessCallback, onCloseComplete])

  return <Dialog
    isShown={true}
    title='Create task'
    isConfirmLoading={isLoading}
    confirmLabel="Create"
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
              <WithLabel label='Title' required>
                <TextInput
                  isInvalid={title && (title.length < 4 || title.length > 80)}
                  value={title || ''}
                  type='text'
                  width="100%"
                  onChange={e => setTitle(e.target.value)}
                />
              </WithLabel>
            </Pane>

            <Pane width="100%" >
              <WithLabel label='Assignee' required>
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
                  isInvalid={description && (description.length > 4000)}
                  validationMessage={description && description.length > 4000 ? 'Max length is 4000' : undefined}
                  value={description || ''}
                  width="100%"
                  onChange={e => setDescription(e.target.value)}
                />
              </WithLabel>
            </Pane>

            { type === TaskTypes.UserStory && 
              <Pane width="100%" >
                <WithLabel label='Points' required>
                <TextInput
                  isInvalid={points && ((points < 0) || (points > 120))}
                  validationMessage={points && points < 0 ? 'Can only be a positive number' : points && points > 120 ? 'Must be inferior to 120' : undefined}
                  value={points}
                  type='number'
                  width="100%"
                  onChange={e => setPoints(e.target.value)}
                />
                </WithLabel>
              </Pane>
            }

            <Pane width="100%" >
              <WithLabel label='Status'>
                <SelectInput 
                  options={Array.from(new Set([ 'todo', 'in progress', 'review' ]))}
                  value={status}
                  onChange={e => setStatus(e.target.value)}
                  required={false}
                />
              </WithLabel>
            </Pane>

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
      { error && <Alert intent="danger" title={error.message || error} marginBottom='16px' /> }
    </div>
  </Dialog>
}

export default TaskCreationDialog