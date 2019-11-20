import React from 'react'
import { Button, Heading, Pane, Text, majorScale } from 'evergreen-ui'

import { useOperation } from '../../library/services/ReactGenericOperation'

import { useAppContextState } from '../context/AppContext'
import Error from './Error'
import TaskCard from './TaskCard'

const Tasks = ({ listTasksOperation }) => {
  const { genericOperationBuilder } = useAppContextState()
  const operation = genericOperationBuilder.fromOperation(listTasksOperation)
  const { filters, makeCall, isLoading, data, error } = useOperation(operation)

  if (isLoading) {
    return <Text>Loading...</Text>
  } else if (error) {
    return <Error error={error}/>
  } else {
    return <>
      <Heading>Tasks filters</Heading>
      { filters }
      { filters && <Button appearance="primary" onClick={makeCall} marginBottom={majorScale(3)}>Update</Button>}

      <Columns labels={['Todo', 'In Progress', 'Done']} tasks={[1,2,3,4,5]} />
    </>
  }
}

const Columns = ({ labels, tasks }) => {
  return <Pane display="flex" width="100%" overflowX="scroll" flexDirection="row">
    { labels.map(label =>
        <Pane  padding={majorScale(1)} display="flex" flexDirection="column" width="220px" height="100%" marginRight={majorScale(1)} background="tint2" borderRadius={majorScale(1)}>
          <Heading marginBottom={majorScale(2)} size={500}>{label.toUpperCase()}</Heading>
          <Pane>
            { tasks.map(task => <Pane marginBottom={majorScale(1)}><TaskCard value={task} /></Pane>) }
          </Pane>
        </Pane>
      )
    }
  </Pane>
}

export default Tasks