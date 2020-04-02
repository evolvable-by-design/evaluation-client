import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Button, Pane, Text, Heading, TextInputField, majorScale } from 'evergreen-ui';  

import CreateProjectDialog from './CreateProjectDialog'
import ProjectCard from './ProjectCard';
import FullscreenError from '../basis/FullscreenError';
import useFetch from '../../hooks/useFetch';
import AuthenticationService from '../../services/AuthenticationService';
import ProjectService from '../../services/ProjectService';


const Projects = () => {
  const [ offset, setOffset ] = useState()
  const [ limit, setLimit ] = useState()

  const { makeCall, isLoading, data, error } = useFetch(() => ProjectService.list({ offset, limit }))
  const { projects, nextPage, lastPage } = data || {}

  const [ showCreateProjectDialog, setShowCreateProjectDialog ] = useState(false)

  const isOffsetInvalid = useMemo(() => offset !== undefined && (isNaN(offset) || (!isNaN(offset) && offset < 0)), [offset])
  const isLimitInvalid = useMemo(() => limit !== undefined && (isNaN(limit) || (!isNaN(limit) && limit < 0)), [limit])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => makeCall(), [])

  
  if (isLoading) {
    return <Text>Loading...</Text>
  } else if (error) {
    return <FullscreenError error={error?.response?.data?.description || error}/>
  } else {
    return <>
      <Heading size={900} marginBottom={majorScale(3)}>Projects</Heading>
      
      <Pane width="100%" display="flex" flexDirection="row" flexWrap="wrap" alignItems="flex-start" justifyContent="flex-start">
        <Pane display="flex" height="100%" marginRight={majorScale(3)} >
          <Pane width={majorScale(24)}>
            <TextInputField 
              label='Offset'
              isInvalid={isOffsetInvalid}
              value={offset || ''}
              placeholder='Offset'
              validationMessage={ isOffsetInvalid ? 'Must be a number >= 0' : null}
              width="100%"
              onChange={e => setOffset(e.target.value)}
            />
          </Pane>
        </Pane>
        <Pane display="flex" height="100%" marginRight={majorScale(3)} >
          <Pane width={majorScale(24)}>
            <TextInputField 
              label='Limit'
              isInvalid={isLimitInvalid}
              value={limit || ''}
              placeholder='Limit'
              validationMessage={ isLimitInvalid ? 'Must be a number >= 0' : null }
              width="100%"
              onChange={e => setLimit(e.target.value)}
            />
          </Pane>
        </Pane>
        
      </Pane>

      <Button appearance="primary" onClick={() => makeCall(() => ProjectService.list({ offset, limit }))} marginBottom={majorScale(3)} marginRight={majorScale(1)}>Update</Button>
      { !AuthenticationService.isAuthenticated() && <Alert intent="none" marginBottom={32} title="Login to see more actions."/> }
      { AuthenticationService.isAuthenticated() && 
          <Button appearance="primary" onClick={() => setShowCreateProjectDialog(true)} marginBottom={majorScale(3)} marginRight={majorScale(1)}>Create project</Button>
      }

      <CreateProjectDialog isShown={showCreateProjectDialog} onSuccessCallback={() => makeCall()} onCloseComplete={() => setShowCreateProjectDialog(false)}/>

      <ProjectCards projects={projects} />

      { nextPage && <Button appearance="primary" onClick={() => makeCall(() => ProjectService.list({ url: nextPage }))} marginBottom={majorScale(3)} marginRight={majorScale(1)}>Next Page</Button>}
      { lastPage && <Button appearance="primary" onClick={() => makeCall(() => ProjectService.list({ url: lastPage }))} marginBottom={majorScale(3)} marginRight={majorScale(1)}>Last Page</Button>}
    </>
  }
};

const ProjectCards = ({projects}) => {
  if (projects !== undefined) {
    return <Pane width='100%' display='flex' flexDirection='row' flexWrap='wrap'>
      { projects.map(project => 
          <ProjectCard
            key={JSON.stringify(project)}
            id={project.id}
            title={project.name}
            collaborators={project.collaborators}
          />) 
      }
    </Pane>
  } else {
    return <Alert intent="danger" title="Sorry we could not find any project." />;
  }
}

export default Projects;
