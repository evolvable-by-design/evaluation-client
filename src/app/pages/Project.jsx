import React, { useMemo, useEffect } from 'react'
import { useParams, Redirect } from 'react-router-dom'

import { useAppContextState } from '../context/AppContext'
import BaseApplicationLayout from '../components/BaseApplicationLayout'
import { ProjectDetailsSemantic } from '../components/ProjectDetails'
import FullscreenLoader from '../components/FullscreenLoader'
import FullScreenError from '../components/FullscreenError'
import Semantics from '../utils/semantics'
import { useOperation } from '../../library/services/ReactGenericOperation'
import { AuthenticationRequiredError } from '../utils/Errors'

const GET_PROJECT_DETAILS_KEY = Semantics.vnd_jeera.terms.getProjectDetails

const ProjectProxyComponent = () => {
  const { id } = useParams()

  const { genericOperationBuilder } = useAppContextState()
  
  try {
    const getProjectDetailsOperation = genericOperationBuilder.fromKey(GET_PROJECT_DETAILS_KEY)
    return <Project getProjectDetailsOperation={getProjectDetailsOperation} id={id} />
  } catch (error) {
    if (error instanceof AuthenticationRequiredError) {
      return <Redirect to={`/login?redirectTo=/project/${id}`} />
    } else {
      return <FullScreenError error='Something unexpected happened. Please try again later.'/>
    }
  }
  
}

const Project = ({getProjectDetailsOperation, id}) => {
  const { makeCall, isLoading, success, data, error } =
    useOperation(getProjectDetailsOperation, { [Semantics.vnd_jeera.terms.projectId]: id})

  useEffect(() => {
    makeCall()
  }, [])

  return <BaseApplicationLayout>
    {
      isLoading ? <FullscreenLoader />
        : error ? <FullScreenError error={error.message}/>
        : success ? <ProjectDetailsSemantic value={data} />
        : <p>Something unexpected happened. Please try again later.</p>
    }
  </BaseApplicationLayout>
}

export default ProjectProxyComponent