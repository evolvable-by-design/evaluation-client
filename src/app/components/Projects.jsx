import React, { useEffect, useState } from 'react';
import { Alert, Button, Pane, Text, Heading, majorScale } from 'evergreen-ui';  

import GenericActionInDialog from '../../library/components/GenericActionInDialog';
import { useOperation } from '../../library/services/ReactGenericOperation';
import GenericFilters from './GenericFilters';

import { ProjectCardSemantic as ProjectCard } from './ProjectCard';
import { useAppContextState } from '../context/AppContext';
import FullscreenError from './FullscreenError';
import Semantics from '../utils/semantics';
import { AuthenticationRequiredError } from '../utils/Errors';

const requiredData = {
  projects: Semantics.vnd_jeera.terms.projects
}

const LIST_PROJECTS_KEY = Semantics.vnd_jeera.terms.listProjects

const Projects = () => {
  const { apiDocumentation, genericOperationBuilder } = useAppContextState()

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const listProjectOperation = genericOperationBuilder.fromKey(LIST_PROJECTS_KEY)
  const { parametersDetail, makeCall, isLoading, data, error } = useOperation(listProjectOperation)
  const [ authRequired, setAuthRequired ] = useState(false)
  const [ createOperation, setCreateOperation ] = useState()

  useEffect(() => makeCall(), [])
  useEffect(() => {
    try {
      if (data) {
        setCreateOperation(data.getRelation(Semantics.vnd_jeera.terms.createRelation, apiDocumentation)[1])
      }
    } catch(e) {
      if (e instanceof AuthenticationRequiredError) {
        setAuthRequired(true)
      }
    }
  }, [data, setCreateOperation, setAuthRequired])
  
    const projects = data !== undefined ? data.get(requiredData.projects) : undefined
    if (isLoading) {
      return <Text>Loading...</Text>
    } else if (error) {
      return <FullscreenError error={error}/>
    } else {
      return <>
        <Heading size={900} marginBottom={majorScale(3)}>Projects</Heading>
        <GenericFilters {...parametersDetail} />
        { (parametersDetail)
          && <Button appearance="primary" onClick={makeCall} marginBottom={majorScale(3)}>Update</Button>
        }
        <AuthRequired authRequired={authRequired}/>
        <ProjectCards projects={projects} />
      </>
    }

};

const ProjectCards = ({projects}) => {
  if (projects !== undefined) {
    return <Pane width='100%' display='flex' flexDirection='row' flexWrap='wrap'>
      { projects.map(project => <ProjectCard key={JSON.stringify(project)} value={project} />) }
    </Pane>
  } else {
    return <Alert intent="danger" title="Sorry we could not find any project." />;
  }
}

const AuthRequired = ({authRequired}) =>
  !authRequired ? null : <Alert intent="none" marginBottom={32} title="Login to see more actions."/>

export default Projects;
