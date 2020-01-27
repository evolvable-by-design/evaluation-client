import React, { useEffect, useState } from 'react';
import { Alert, Button, Pane, Text, Heading, majorScale } from 'evergreen-ui';  

import { useOperation } from '../../library/services/ReactGenericOperation';
import GenericFilters from './GenericFilters';

import ActionDialog from './ActionDialog'
import { ProjectCardSemantic as ProjectCard } from './ProjectCard';
import { useAppContextState } from '../context/AppContext';
import FullscreenError from './FullscreenError';
import Semantics from '../utils/semantics';
import LoginRedirect from './LoginRedirect';

const requiredData = {
  projects: Semantics.vnd_jeera.terms.projects
}

const LIST_PROJECTS_KEY = Semantics.vnd_jeera.terms.listProjects

const Projects = () => {
  const { apiDocumentation, genericOperationBuilder } = useAppContextState()

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const listProjectOperation = genericOperationBuilder.fromKey(LIST_PROJECTS_KEY)
  const { userShouldAuthenticate, parametersDetail, makeCall, isLoading, data, error } = useOperation(listProjectOperation)
  const createOperation = data ? data.getRelation(Semantics.vnd_jeera.terms.createRelation, apiDocumentation)[1] : undefined

  useEffect(() => makeCall(), [])
  
  const projects = data !== undefined ? data.get(requiredData.projects) : undefined
  if (userShouldAuthenticate) {
    return <LoginRedirect />
  } else if (isLoading) {
    return <Text>Loading...</Text>
  } else if (error) {
    return <FullscreenError error={error}/>
  } else {
    return <>
      <Heading size={900} marginBottom={majorScale(3)}>Projects</Heading>
      <GenericFilters {...parametersDetail} />
      { (parametersDetail)
        && <Button appearance="primary" onClick={makeCall} marginBottom={majorScale(3)} marginRight={majorScale(1)}>Update</Button>
      }
      { createOperation && <CreateProject operation={createOperation} onSuccessCallback={makeCall}/> }
      <AuthRequired authRequired={createOperation?.userShouldAuthenticate}/>
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

const CreateProject = ({operation, onSuccessCallback}) => {
  const [isShown, setIsShown] = useState(false)
  return <>
    <ActionDialog
      isShown={isShown}
      title={operation.summary || 'Create project'}
      operationSchema={operation}
      onSuccessCallback={onSuccessCallback}
      onCloseComplete={() => setIsShown(false)}
    />
    <Button appearance="primary" iconBefore="plus" onClick={() => setIsShown(true)} marginBottom={majorScale(3)} marginRight={majorScale(1)}>Create a new project</Button>
  </>
}

export default Projects;
