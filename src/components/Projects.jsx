import React from 'react';
import { Alert, Button, Pane, Text, Heading, majorScale } from 'evergreen-ui';  

import { ProjectSemanticBuilder } from './Project';
import GenericActionInDialog from './generic/GenericActionInDialog';

import { useAppContext } from '../components/App';
import FullscreenError from '../components/FullscreenError';
import useGenericOperationResolver from '../hooks/useGenericOperationResolver';
import useRelations from '../hooks/useRelations';
import Semantics from '../utils/semantics';

const Project = ProjectSemanticBuilder.build();

const requiredData = {
  projects: Semantics.vnd_jeera.terms.projects
}

const Projects = () => {
  const { apiDocumentation } = useAppContext();

  const [ projectsList, isLoading, error, triggerCall, filtersToDisplay, formToDisplay ] =
    useGenericOperationResolver(Semantics.vnd_jeera.terms.listProjects);

  const projects = projectsList !== undefined ? projectsList.get(requiredData.projects) : undefined;

  const [createOperation, authRequired] = useRelations(projectsList, apiDocumentation, Semantics.vnd_jeera.terms.createRelation);

  if (isLoading) {
    return <><Text>Loading...</Text></>
  } else if (error) {
    return <FullscreenError error={error}/>
  } else {
    return <>
      <Heading size={900} marginBottom={majorScale(3)}>Projects</Heading>
      { filtersToDisplay }
      { formToDisplay }
      { (filtersToDisplay || formToDisplay)
        && <Button appearance="primary" onClick={triggerCall} marginBottom={majorScale(3)}>Update</Button>
      }
      { createOperation && 
        <Pane marginBottom={majorScale(3)}>
          <Heading marginBottom={majorScale(2)}>Actions</Heading>
          <GenericActionInDialog operation={createOperation[1]} buttonAppearance="primary" onSuccessCallback={triggerCall} />
        </Pane>
      }
      { authRequired && <Alert intent="none" marginBottom={32} title="Login to see more actions."/> }
      <ProjectCards projects={projects} />
    </>
  }
};

const ProjectCards = ({projects}) => {
  if (projects !== undefined) {
    return <Pane width='100%' display='flex' flexDirection='row' flexWrap='wrap'>
      { projects.map(project => <Project key={JSON.stringify(project)} value={project} />) }
    </Pane>
  } else {
    return <Alert intent="danger" title="Sorry we could not find any project." />;
  }
}

export default Projects;
