import React, { useMemo } from 'react';
import { Alert, Button, Pane, Text, Heading, majorScale } from 'evergreen-ui';  

import { ProjectSemanticBuilder } from './Project';
import GenericActionInDialog from '../../library/components/GenericActionInDialog';

import { useAppContextState } from '../context/AppContext';
import FullscreenError from '../components/FullscreenError';
import useRelations from '../../library/hooks/useRelations';
import Semantics from '../utils/semantics';
import { useOperation } from '../../library/services/ReactGenericOperation';

const Project = ProjectSemanticBuilder.build();

const requiredData = {
  projects: Semantics.vnd_jeera.terms.projects
}

const Projects = () => {
  const listProjectsKey = Semantics.vnd_jeera.terms.listProjects
  const { apiDocumentation, genericOperationBuilder } = useAppContextState()

  const listProjectOperation = useMemo(() => genericOperationBuilder.fromKey(listProjectsKey), [])
  const { form, filters, makeCall, isLoading, success, data, error } = useOperation(listProjectOperation)

  const projects = data !== undefined ? data.get(requiredData.projects) : undefined;

  const [createOperation, authRequired] = useRelations(data, apiDocumentation, Semantics.vnd_jeera.terms.createRelation);

  if (isLoading) {
    return <Text>Loading...</Text>
  } else if (error) {
    return <FullscreenError error={error}/>
  } else {
    return <>
      <Heading size={900} marginBottom={majorScale(3)}>Projects</Heading>
      { filters }
      { form }
      { (filters || form)
        && <Button appearance="primary" onClick={makeCall} marginBottom={majorScale(3)}>Update</Button>
      }
      <Operations createOperation={createOperation} triggerCall={makeCall} />
      <AuthRequired authRequired={authRequired}/>
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

const Operations = ({creationOperation, triggerCall}) => {
  if (!creationOperation) return null

  return (
    <Pane marginBottom={majorScale(3)}>
      <Heading marginBottom={majorScale(2)}>Actions</Heading>
      <GenericActionInDialog operation={creationOperation[1]} buttonAppearance="primary" onSuccessCallback={triggerCall} />
    </Pane>
  )
}

const AuthRequired = ({authRequired}) =>
  !authRequired ? null : <Alert intent="none" marginBottom={32} title="Login to see more actions."/>

export default Projects;
