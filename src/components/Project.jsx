import React from 'react';
import { Alert, Avatar, Badge, Card, Heading, Pane, Paragraph, majorScale } from 'evergreen-ui';

import { onlyWhen } from '../utils/javascript-utils';
import { SemanticComponentBuilder } from '../services/SemanticComponentBuilder';
import Semantics from '../utils/semantics';

const Project = ({title, isPublic, lastUpdate, collaborators}) =>
  <Card display="flex" flexDirection="column" elevation={1} hoverElevation={3} width={majorScale(40)} padding={majorScale(2)} minHeight="100px" >
    <Pane display="flex" flexDirection="row" marginBottom={majorScale(2)}>
      <Heading flexGrow="10">{title}</Heading>
      { onlyWhen(isPublic, () => <IsPublicBadge isPublic={isPublic} />) }
    </Pane>
    { onlyWhen(lastUpdate, () => <Paragraph><b>Last updated on:</b>{lastUpdate}</Paragraph>) }
    <Pane>
      <Heading size={300} marginBottom={majorScale(1)} >Collaborators</Heading>
      { collaborators.map(collaborator => <CollaboratorBadge key={collaborator} name={collaborator} />)}
    </Pane>
  </Card>

const IsPublicBadge = ({isPublic}) =>
  <Badge color={ isPublic ? "green" : "purple"} flexGrow="1">
    {isPublic ? "Public" : "Private"}
  </Badge>

const CollaboratorBadge = ({name}) => <Avatar name={name} size={30} />

export const ProjectSemanticBuilder = new SemanticComponentBuilder(
  Semantics.schema.terms.Project,
  Project,
  {
    title: Semantics.schema.terms.name,
    collaborators: Semantics.vnd_jeera.terms.collaborators,
  },
  {
    isPublic: Semantics.vnd_jeera.terms.isPublic,
    lastUpdate: Semantics.schema.terms.lastUpdate
  },
  undefined,
  errorHandler
);

function errorHandler (e) {
  console.error(e);
  if (e.missingData) {
    return <Alert
      intent="danger"
      title={`Unable to display project, required data are missing: ${e.missingData}`}
    />
  }
}

export default Project;