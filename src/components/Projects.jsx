import React from 'react';

import { Text } from 'evergreen-ui';  

import useGenericOperationResolver from '../hooks/useGenericOperationResolver';
import Semantics from '../utils/semantics';

const Projects = () => {
  const [data, isLoading, error, filtersToDisplay, formToDisplay] = useGenericOperationResolver(Semantics.vnd_jeera.terms.listProjects);

  if (isLoading) {
    return <Text>Loading...</Text>
  } else if (error) {
    return <Text>{error}</Text>
  } else if (filtersToDisplay || formToDisplay) {
    return <Text>Inputs are required</Text>
  } else {
    return <Text>{JSON.stringify(data)}</Text>
  }
  
};

export default Projects;