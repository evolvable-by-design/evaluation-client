import React, { useMemo, useState } from 'react';
import { Alert, Button, Pane, Text, Heading, majorScale } from 'evergreen-ui';  

import { ProjectCardSemanticBuilder } from './ProjectCard';
import GenericActionInDialog from '../../library/components/GenericActionInDialog';

import { useAppContextState } from '../context/AppContext';
import FullscreenError from '../components/FullscreenError';
import Semantics from '../utils/semantics';
import { useOperation } from '../../library/services/ReactGenericOperation';

const ProjectCard = ProjectCardSemanticBuilder.build();

const requiredData = {
  projects: Semantics.vnd_jeera.terms.projects
}

const LIST_PROJECTS_KEY = Semantics.vnd_jeera.terms.listProjects

const Projects = () => {
  const { apiDocumentation, genericOperationBuilder } = useAppContextState()

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const listProjectOperation = useMemo(() => genericOperationBuilder.fromKey(LIST_PROJECTS_KEY), [])
  const { form, filters, makeCall, isLoading, data, error } = useOperation(listProjectOperation)

  const projects = data !== undefined ? data.get(requiredData.projects) : undefined

  const [ authRequired, setAuthRequired ] = useState(false)
  const [ createOperation, setCreateOperation ] = useState()

  try {
    const createOperationRel = data !== undefined ? data.getRelation(Semantics.vnd_jeera.terms.createRelation, apiDocumentation)[1] : undefined
    setCreateOperation(createOperationRel)
  } catch (e) {
    // TODO if (e instanceof AuthenticationRequiredError) { setAuthRequired(true) }
  }

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
      { projects.map(project => <ProjectCard key={JSON.stringify(project)} value={project} />) }
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
