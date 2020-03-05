import React, { useEffect, useState }  from 'react'
import { Button, Heading, Pane, Text, majorScale, minorScale } from 'evergreen-ui'

import SemanticComponentBuilder from '../../../library/services/SemanticComponentBuilder'
import ActionDialog from '../generic/ActionDialog'
import { useOperation } from '../../../library/services/ReactGenericOperation'

import { defaultSemanticComponentErrorHandler } from '../../utils/Errors'
import { capitalize, spaceCamelCaseWord } from '../../utils/javascriptUtils'
import Semantics from '../../utils/semantics'
import { useAppContextState } from '../../context/AppContext'
import Error from '../basis/Error'
import { TaskCardSemantic as TaskCard } from '../task/TaskCard'
import TaskFocus from '../task/TaskFocus'
import GenericFilters from '../generic/GenericFilters'

const ProjectDetails = ({ title, refreshProjectFct, semanticData }) => {
  // eslint-disable-next-line
  const listTasksOperation = semanticData.getRelation(Semantics.vnd_jeera.relations.listProjectTasks, 1)?.operation

  const operations = [ 
    Semantics.vnd_jeera.relations.archive,
    Semantics.vnd_jeera.relations.unarchive,
    Semantics.vnd_jeera.relations.inviteToCollaborate,
    Semantics.vnd_jeera.relations.delete,
    Semantics.vnd_jeera.relations.create
  ]
  
  const availableOperations = semanticData.getRelations(operations)
  
  const [ operationFocus, setOperationFocus ] = useState()

  return <>
    <Pane display="flex" flexDirection="row" justifyContent="space-between" width="100%" overflow="hidden" marginBottom={majorScale(4)}>
      <Heading size={900}>{title}</Heading>
      <Pane display="flex" flexDirection="row" justifyContent="flex-end" flexWrap="wrap">
        { availableOperations.map(operation => 
            <Button key={`button-${operation.key}`} appearance="default" marginRight={majorScale(2)} marginBottom={majorScale(1)} onClick={() => setOperationFocus(operation)}>{ spaceCamelCaseWord(capitalize(operation.key)) }</Button>
        ) }

      </Pane>
    </Pane>
    
    <Tasks listTasksOperation={listTasksOperation} />
    { operationFocus && <ActionDialog title={operationFocus.key} operationSchema={operationFocus.operation} onSuccessCallback={() => refreshProjectFct()} onCloseComplete={() => setOperationFocus(undefined)}/> }
  </>
}

const Tasks = ({ listTasksOperation }) => {
  const { genericOperationBuilder, apiDocumentation } = useAppContextState()
  const operation = genericOperationBuilder.fromOperation(listTasksOperation)
  const { parametersDetail, makeCall, isLoading, data, error } = useOperation(operation)
  // { values, setter, documentation }

  const taskStatusTypeDoc = apiDocumentation.findTypeInOperationResponse(Semantics.vnd_jeera.terms.TaskStatus, listTasksOperation)
  const tasks = data ? data.get(Semantics.vnd_jeera.terms.tasks) : undefined

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