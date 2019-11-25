import React, { useEffect } from 'react'
import { Button, Heading, Pane, Text, majorScale, minorScale } from 'evergreen-ui'

import { useOperation } from '../../library/services/ReactGenericOperation'

import useQuery from '../hooks/useQuery'
import Semantics from '../utils/semantics'
import { useAppContextState } from '../context/AppContext'
import Error from './Error'
import { TaskCardSemantic as TaskCard } from './TaskCard'
import { TaskDialogSemantic as TaskDialog } from './TaskDialog'

const Tasks = ({ listTasksOperation }) => {
  const { genericOperationBuilder, apiDocumentation } = useAppContextState()
  const operation = genericOperationBuilder.fromOperation(listTasksOperation)
  const { filters, makeCall, isLoading, data, error } = useOperation(operation)

  const taskStatusTypeDoc = apiDocumentation.findTypeInOperationResponse(Semantics.vnd_jeera.terms.TaskStatus, listTasksOperation)
  const tasks = data ? data.get(Semantics.vnd_jeera.terms.tasks) : undefined

  useEffect(() => makeCall(), [])

  if (isLoading) {
    return <Text>Loading...</Text>
  } else if (error) {
    return <Error error={error}/>
  } else {
    return <>
      <Heading>Tasks filters</Heading>
      { filters }
      { filters && <Button appearance="primary" onClick={makeCall} marginBottom={majorScale(3)}>Update</Button>}
      {
        data
          ? <Columns labels={taskStatusTypeDoc.enum} tasks={tasks} />
          : <Heading>Please figure out how to fetch tasks :).</Heading>
      }
      <TaskFocus tasks={tasks} />
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
                .filter(task => task.getValue(Semantics.vnd_jeera.terms.TaskStatus) === label)
                .map(task => <Pane key={JSON.stringify(task)} marginBottom={majorScale(1)}><TaskCard value={task} /></Pane>)
            }
          </Pane>
        </Pane>
      )
    }
  </Pane>
}

const TaskFocus = ({tasks}) => {
  const { taskFocus } = useQuery()

  if (tasks === undefined || taskFocus === undefined) {
    return null
  }

  const task = tasks.find(task => task.getValue(Semantics.vnd_jeera.terms.taskId) === taskFocus)
  return <TaskDialog value={task} />
}

export default Tasks