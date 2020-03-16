import React from 'react';
import { Link } from 'react-router-dom'
import { Badge, Card, Heading, Pane, Paragraph, majorScale } from 'evergreen-ui';

import UserId from '../user/UserId'

const ProjectCard = ({id, title, isPublic, lastUpdate, collaborators}) =>
  <Card display="flex" flexDirection="column" elevation={1} hoverElevation={3} width={majorScale(40)} padding={majorScale(2)} marginRight={majorScale(3)} marginBottom={majorScale(3)} minHeight="100px" >
    <Pane display="flex" flexDirection="row" marginBottom={majorScale(2)}>
      <Link to={`/project/${id}`} style={{flexGrow: 10}}><Heading>{title}</Heading></Link>
      <IsPublicBadge isPublic={isPublic} />
    </Pane>
    <Paragraph><b>Last updated on: </b>{lastUpdate}</Paragraph>
    <Pane>
      <Heading size={300} marginBottom={majorScale(1)} >Collaborators</Heading>
      { collaborators.map(collaborator => <UserId key={collaborator} id={collaborator} noLabel />)}
    </Pane>
  </Card>

const IsPublicBadge = ({isPublic}) =>
  <Badge color={ isPublic ? "green" : "purple"} flexGrow="1">
    {isPublic ? "Public" : "Private"}
  </Badge>

export default ProjectCard;