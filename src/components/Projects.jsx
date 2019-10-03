import React, { useMemo } from 'react';
import { Alert, Button, Text, Heading, majorScale } from 'evergreen-ui';  

import { ProjectSemanticBuilder } from './Project';
import GenericOperationModal from './GenericOperationModal';

import { useApiContext } from '../components/App';
import useGenericOperationResolver from '../hooks/useGenericOperationResolver';
import Semantics from '../utils/semantics';
import { onlyWhen } from '../utils/javascript-utils';

const Project = ProjectSemanticBuilder.build();

const requiredData = {
  projects: Semantics.vnd_jeera.terms.projects
}

const Projects = () => {
  const apiDocumentation = useApiContext();

  const [ semanticData, isLoading, error, triggerCall, filtersToDisplay, formToDisplay ] =
    useGenericOperationResolver(Semantics.vnd_jeera.terms.listProjects);

  const projects = useMemo(() =>
    semanticData !== undefined ? semanticData.get(requiredData.projects) : undefined, [semanticData]);
  const createOperation = useMemo(() =>
    semanticData !== undefined ? semanticData.getRelation(Semantics.vnd_jeera.terms.createRelation, apiDocumentation) : undefined, [semanticData, apiDocumentation]);

  if (isLoading) {
    return <Text>Loading...</Text>
  } else if (error) {
    return <Text>{error}</Text>
  } else {
    return <>
      <Heading size={900} marginBottom={majorScale(3)}>Projects</Heading>
      { filtersToDisplay }
      { formToDisplay }
      { onlyWhen(filtersToDisplay || formToDisplay, () =>
        <Button appearance="primary" onClick={triggerCall} marginBottom={majorScale(3)}>Update</Button>
      )}
      { onlyWhen(createOperation, () =>
          <GenericOperationModal operation={createOperation} buttonAppearance="primary" />
      )}
      <ProjectCards projects={projects} />
    </>
  }
  
};

const ProjectCards = ({projects}) => {
  if (projects !== undefined) {
    return projects.map(project => <Project key={project} value={project} />)
  } else {
    return <Alert intent="danger" title="Sorry we could not find any project." />;
  }
}

export default Projects;