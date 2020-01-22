import React from 'react';
import { Link } from 'react-router-dom'
import { Avatar, Badge, Card, Heading, Pane, Paragraph, majorScale } from 'evergreen-ui';

import { onlyWhen } from '../utils/javascriptUtils';
import { SemanticComponentBuilder } from '../../library/services/SemanticComponentBuilder';
import Semantics from '../utils/semantics';
import { defaultSemanticComponentErrorHandler } from '../utils/Errors';
import UserId from './UserId'

const ProjectCard = ({id, title, isPublic, lastUpdate, collaborators, collaboratorsSemantics}) =>
  <Card display="flex" flexDirection="column" elevation={1} hoverElevation={3} width={majorScale(40)} padding={majorScale(2)} marginRight={majorScale(3)} marginBottom={majorScale(3)} minHeight="100px" >
    <Pane display="flex" flexDirection="row" marginBottom={majorScale(2)}>
      <Link to={`/project/${id}`}><Heading flexGrow="10">{title}</Heading></Link>
      { onlyWhen(isPublic, () => <IsPublicBadge isPublic={isPublic} />) }
    </Pane>
    { onlyWhen(lastUpdate, () => <Paragraph><b>Last updated on:</b>{lastUpdate}</Paragraph>) }
    <Pane>
      <Heading size={300} marginBottom={majorScale(1)} >Collaborators</Heading>
      { collaborators.map((collaborator, i) => <UserId key={collaborator} value={collaborator} valueSemantics={collaboratorsSemantics[i]} noLabel />)}
    </Pane>
  </Card>

const IsPublicBadge = ({isPublic}) =>
  <Badge color={ isPublic ? "green" : "purple"} flexGrow="1">
    {isPublic ? "Public" : "Private"}
  </Badge>

export const ProjectCardSemanticBuilder = new SemanticComponentBuilder(
  Semantics.schema.terms.Project,
  ProjectCard,
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

export const ProjectCardSemantic = ProjectCardSemanticBuilder.build()

export default ProjectCard;