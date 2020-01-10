import React, { useEffect, useState }  from 'react'
import { Button, Heading, Pane, Text, majorScale, minorScale } from 'evergreen-ui'

import SemanticComponentBuilder from '../../library/services/SemanticComponentBuilder'
import ActionDialog from './ActionDialog'
import { useOperation } from '../../library/services/ReactGenericOperation'

import { defaultSemanticComponentErrorHandler } from '../utils/Errors'
import { capitalize, spaceCamelCaseWord } from '../utils/javascriptUtils'
import Semantics from '../utils/semantics'
import { useAppContextState } from '../context/AppContext'
import Error from './Error'
import { TaskCardSemantic as TaskCard } from './TaskCard'
import TaskFocus from './TaskFocus'
import GenericFilters from './GenericFilters'

const ProjectDetails = ({ title, semanticData }) => {
  const { genericOperationBuilder, apiDocumentation } = useAppContextState()

  // eslint-disable-next-line
  const [ listTasksLabel, listTasksOperation ] = semanticData.getRelation(Semantics.vnd_jeera.relations.listProjectTasks)
  const operation = genericOperationBuilder.fromOperation(listTasksOperation)
  const { parametersDetail, makeCall, isLoading, data, error } = useOperation(operation)
  // { values, setter, documentation }

  const taskStatusTypeDoc = apiDocumentation.findTypeInOperationResponse(Semantics.vnd_jeera.terms.TaskStatus, listTasksOperation)
  const tasks = data ? data.get(Semantics.vnd_jeera.terms.tasks) : undefined

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => makeCall(), [])

  const otherOperations = semanticData.getOtherRelations()
  const [ operationFocus, setOperationFocus ] = useState()

  return <>
    <Pane display="flex" flexDirection="row" justifyContent="space-between" width="100%" overflow="hidden" marginBottom={majorScale(4)}>
      <Heading size={900}>{title}</Heading>
      <Pane flexDirection="column">
        { otherOperations.map(operation =>
          <Button key={`button-${operation[0]}`} appearance="default" marginRight={majorScale(2)} onClick={() => setOperationFocus(operation)}>{ spaceCamelCaseWord(capitalize(operation[0])) }</Button>
        ) }
      </Pane>
    </Pane>
    <Tasks isLoading={isLoading} error={error} parametersDetail={parametersDetail} tasks={tasks} makeCall={makeCall} taskStatusTypeDoc={taskStatusTypeDoc} />
    { operationFocus && <ActionDialog title={operationFocus[0]} operationSchema={operationFocus[1]} onSuccessCallback={() => { makeCall(); setOperationFocus(undefined);}} onCloseComplete={() => setOperationFocus(undefined)}/> }
  </>
}

const Tasks = ({ isLoading, error, parametersDetail, tasks, makeCall, taskStatusTypeDoc }) => {
  if (isLoading) {
    return <Text>Loading...</Text>
  } else if (error) {
    return <Error error={error}/>
  } else {
    return <>
      <div>
        <Heading>Tasks filters</Heading>
        <GenericFilters {...parametersDetail} />
        { parametersDetail && <Button appearance="primary" onClick={makeCall} marginBottom={majorScale(3)}>Filter</Button>}
      </div>
      {
        tasks
          ? <Columns labels={taskStatusTypeDoc.enum} tasks={tasks} />
          : <Heading>Please figure out how to fetch tasks :).</Heading>
      }
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
                .filter(task => task.getValue(Semantics.vnd_jeera.terms.TaskStatus) === label)
                .map(task => <Pane key={JSON.stringify(task)} marginBottom={majorScale(1)}><TaskCard value={task} /></Pane>)
            }
          </Pane>
        </Pane>
      )
    }
  </Pane>
}

export const ProjectDetailsSemanticBuilder = new SemanticComponentBuilder(
  Semantics.schema.terms.Project,
  ProjectDetails,
  {
    id: Semantics.vnd_jeera.terms.projectId,
    title: Semantics.schema.terms.name,
    collaborators: Semantics.vnd_jeera.terms.collaborators,
  },
  {
    isPublic: Semantics.vnd_jeera.terms.isPublic,
    lastUpdate: Semantics.schema.terms.lastUpdate
  },
  undefined,
  defaultSemanticComponentErrorHandler('project')
)

export const ProjectDetailsSemantic = ProjectDetailsSemanticBuilder.build()

export default ProjectDetails