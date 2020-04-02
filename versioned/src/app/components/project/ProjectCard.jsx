import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Card, Heading, Pane, Paragraph, majorScale } from 'evergreen-ui';

import AnalyticsService from '../../services/AnalyticsService';
import UserId from '../user/UserId'
import useFetch from '../../hooks/useFetch'

const ProjectCard = ({id, title, collaborators }) => {
  const { makeCall, data: analytics } = useFetch(() => AnalyticsService.findOne(id))

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => makeCall(), [])

  return <StatelessProjectCard id={id} title={title} collaborators={collaborators} lastUpdate={analytics?.lastUpdatedOn} />
}

const StatelessProjectCard = ({id, title, lastUpdate, collaborators}) =>
  <Card display="flex" flexDirection="column" elevation={1} hoverElevation={3} width={majorScale(40)} padding={majorScale(2)} marginRight={majorScale(3)} marginBottom={majorScale(3)} minHeight="100px" >
    <Pane display="flex" flexDirection="row" marginBottom={majorScale(2)}>
      <Link to={`/project/${id}`} style={{flexGrow: 10}}><Heading>{title}</Heading></Link>
    </Pane>
    <Paragraph><b>Last updated on: </b>{lastUpdate}</Paragraph>
    <Pane>
      <Heading size={300} marginBottom={majorScale(1)} >Collaborators</Heading>
      { collaborators.map(collaborator => <UserId key={collaborator} id={collaborator} noLabel />)}
    </Pane>
  </Card>

export default ProjectCard;