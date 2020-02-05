import React, { useEffect, useState }  from 'react'
import { useHistory } from 'react-router-dom'
import { Button, Heading, Pane, Text, TextInputField, majorScale, minorScale } from 'evergreen-ui'

import { capitalize, spaceCamelCaseWord } from '../../utils/javascriptUtils'
import AddCollaboratorDialog from './AddCollaboratorDialog'
import ArchiveProjectDialog from './ArchiveProjectDialog'
import DeleteProjectDialog from './DeleteProjectDialog'
import Error from '../basis/Error'
import TaskCard from '../task/TaskCard'
import TaskCreationDialog from '../task/TaskCreationDialog'
import TaskFocus from '../task/TaskFocus'
import UnarchiveProjectDialog from './UnarchiveProjectDialog'

import useFetch from '../../hooks/useFetch'
import TaskService from '../../services/TaskService'
import { TaskTypes } from '../../domain/Task'

const ProjectDetails = ({ title, isArchived, projectId, refreshProjectFct }) => {
  const operations = [ 'Archive', 'Unarchive', 'Add Collaborator', 'Delete', 'Create technical story', 'Create user story' ]
  const [ operationFocus, setOperationFocus ] = useState()
  const history = useHistory()

  return <>
    <Pane display="flex" flexDirection="row" justifyContent="space-between" width="100%" overflow="hidden" marginBottom={majorScale(4)}>
      <Heading size={900}>{title}</Heading>
      <Pane display="flex" flexDirection="row" justifyContent="flex-end" flexWrap="wrap">
        { operations
            .filter(shouldDisplayOperation(isArchived))
            .map(operation => 
              <Button key={`button-${operation}`} appearance="default" marginRight={majorScale(2)} marginBottom={majorScale(1)} onClick={() => setOperationFocus(operation)}>{ spaceCamelCaseWord(capitalize(operation)) }</Button>
        ) }

      </Pane>
    </Pane>
    
    <Tasks projectId={projectId} />
    
    { operationFocus === 'Archive' ? <ArchiveProjectDialog projectId={projectId} onSuccessCallback={() => refreshProjectFct()} onCloseComplete={() => setOperationFocus(undefined)} />
      : operationFocus === 'Unarchive' ? <UnarchiveProjectDialog projectId={projectId} onSuccessCallback={() => refreshProjectFct()} onCloseComplete={() => setOperationFocus(undefined)} />
      : operationFocus === 'Add Collaborator' ? <AddCollaboratorDialog projectId={projectId} onSuccessCallback={() => refreshProjectFct()} onCloseComplete={() => setOperationFocus(undefined)} />
      : operationFocus === 'Delete' ? <DeleteProjectDialog projectId={projectId} onSuccessCallback={() => history.push('/')} onCloseComplete={() => setOperationFocus(undefined)} />
      : operationFocus === 'Create user story' ? <TaskCreationDialog projectId={projectId} type={TaskTypes.UserStory} onSuccessCallback={() => refreshProjectFct()} onCloseComplete={() => setOperationFocus(undefined)} />
      : operationFocus === 'Create technical story' ? <TaskCreationDialog projectId={projectId} type={TaskTypes.TechnicalStory} onSuccessCallback={() => refreshProjectFct()} onCloseComplete={() => setOperationFocus(undefined)} />
      : null
    }
    
     
  </>
}
// <ActionDialog title={operationFocus[0]} operationSchema={operationFocus[1]} onSuccessCallback={() => makeCall()} onCloseComplete={() => setOperationFocus(undefined)}/>

function shouldDisplayOperation(isArchived) {
  return operation =>
    operation === 'Archive' ? !isArchived
    : operation === 'Unarchive' ? isArchived
    : operation === 'Delete' ? isArchived
    : true
}

const Tasks = ({ projectId }) => {
  const [ offset, setOffset ] = useState()
  const [ limit, setLimit ] = useState()
  const [ createdAfter, setCreatedAfter ] = useState()
  const { makeCall, isLoading, data, error } = useFetch(() => TaskService.list(projectId, offset, limit, createdAfter))
  const tasks = data

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => makeCall(), [])

  if (isLoading) {
    return <Text>Loading...</Text>
  } else if (error) {
    return <Error error={error}/>
  } else {
    return <>
      <div>
        <Heading>Tasks filters</Heading>
        
        <Pane width="100%" display="flex" flexDirection="row" flexWrap="wrap" alignItems="flex-start" justifyContent="flex-start">
        
          <Pane display="flex" height="100%" marginRight={majorScale(3)} >
            <Pane width={majorScale(24)}>
              <TextInputField 
                label='Offset'
                isInvalid={isNumberInvalid(offset)}
                value={offset || ''}
                placeholder='Offset'
                validationMessage={ isNumberInvalid(offset) ? 'Must be a number' : undefined }
                width="100%"
                onChange={e => setOffset(e.target.value)}
              />
            </Pane>
          </Pane>

          <Pane display="flex" height="100%" marginRight={majorScale(3)} >
            <Pane width={majorScale(24)}>
              <TextInputField 
                label='Limit'
                isInvalid={isNumberInvalid(limit)}
                value={limit || ''}
                placeholder='Limit'
                validationMessage={ isNumberInvalid(limit) ? 'Must be a number' : undefined }
                width="100%"
                onChange={e => setLimit(e.target.value)}
              />
            </Pane>
          </Pane>

          <Pane display="flex" height="100%" marginRight={majorScale(3)} >
            <Pane width={majorScale(24)}>
              <TextInputField 
                label='Created after'
                value={createdAfter}
                placeholder='Created after'
                type='date'
                width="100%"
                onChange={e => setCreatedAfter(e.target.value)}
              />
            </Pane>
          </Pane>

        </Pane>

        <Button appearance="primary" onClick={makeCall} marginBottom={majorScale(3)}>Filter</Button>
      </div>
      
      <Columns labels={['todo', 'in progress', 'review', 'QA', 'done']} tasks={tasks || []} />
      <TaskFocus tasks={tasks} onOperationInvokationSuccess={() => makeCall()} />

    </>
  }
}

const Columns = ({ labels, tasks }) => {
  return <Pane display="flex" width="100%" overflowX="scroll" flexDirection="row">
    { labels.map(label =>
        <Pane key={label} padding={majorScale(1)} display="flex" flexDirection="column" width="300px" minHeight="300px" marginRight={majorScale(1)} background="tint2" borderRadius={minorScale(1)}>
          <Heading marginBottom={majorScale(2)} size={400}>{label.toUpperCase()}</Heading>
          <Pane>
            { tasks
                .filter(task => task.status === label)
                .map(task => 
                  <Pane key={JSON.stringify(task)} marginBottom={majorScale(1)}>
                    <TaskCard id={task.id} title={task.name} points={task.points} />
                  </Pane>
                )
            }
          </Pane>
        </Pane>
      )
    }
  </Pane>
}

function isNumberInvalid(number) {
  return number !== undefined && (isNaN(number) || (!isNaN(number) && number < 0))
}

export default ProjectDetails