import React from 'react';
import { Alert, Text, Heading, Paragraph, majorScale } from 'evergreen-ui';  

import { ProjectSemanticBuilder } from './Project';

import useGenericOperationResolver from '../hooks/useGenericOperationResolver';
import Semantics from '../utils/semantics';

const Project = ProjectSemanticBuilder.build();

const requiredData = {
  projects: Semantics.vnd_jeera.terms.projects
}

const Projects = () => {
  const [ data, isLoading, error, filtersToDisplay, formToDisplay ] =
    useGenericOperationResolver(Semantics.vnd_jeera.terms.listProjects);

  const projects = data !== undefined ? data.get(requiredData.projects) : undefined;

  if (isLoading) {
    return <Text>Loading...</Text>
  } else if (error) {
    return <Text>{error}</Text>
  } else if (filtersToDisplay || formToDisplay) {
    return <>
      <Heading size={900} marginBottom={majorScale(3)}>Projects</Heading>
      { filtersToDisplay }
      { formToDisplay }

      { projects
          ? projects.map(project => <Project key={project} value={project} />)
          : <Alert intent="danger" title="Sorry we could not find any project." />
      }
    </>
  } else {
    return <Paragraph>{JSON.stringify(data)}</Paragraph>
  }
  
};

export default Projects;