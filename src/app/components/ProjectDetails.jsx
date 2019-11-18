import React, { useEffect, useMemo } from 'react'
import { Alert, Heading, Pane, majorScale } from 'evergreen-ui'

import Semantics from '../utils/semantics'
import SemanticComponentBuilder from '../../library/services/SemanticComponentBuilder'
import { useAppContextState } from '../context/AppContext'
import GenericActionInDialog from '../../library/components/GenericActionInDialog'

const ProjectDetails = ({id, title, collaborators, lastUpdate, semanticData}) => {
  const { apiDocumentation } = useAppContextState()

  const listTasksOperation = semanticData.getRelation(Semantics.vnd_jeera.relations.listProjectTasks, apiDocumentation)
  const otherOperations = semanticData.getOtherRelations(apiDocumentation)

  return <>
    <Pane display="flex" flexDirection="row" justifyContent="space-between" width="100%" overflow="hidden">
      <Pane><Heading size={900}>{title}</Heading></Pane>
      <Pane flexDirection="column">{otherOperations.map(op => <GenericActionInDialog label={op[0]} key={op[0]} alwaysShown={false} operation={op[1]} buttonAppearance="default" />)}</Pane>
    </Pane>
    <TasksComponent listTasksOperation={listTasksOperation}/>
  </>
}

const TasksComponent = ({ listTasksOperation }) => {
  return <p>Tasks will appear over here very soon. Believe me :)</p>
}

export const ProjectDetailsSemantic = new SemanticComponentBuilder(
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
  errorHandler
).build();

function errorHandler (e) {
  console.error(e);
  if (e.missingData) {
    return <Alert
      intent="danger"
      title={`Unable to display project, required data are missing: ${e.missingData}`}
    />
  }
}

export default ProjectDetails