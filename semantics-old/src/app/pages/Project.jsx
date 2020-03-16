import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'

import { useAppContextState } from '../context/AppContext'
import BaseApplicationLayout from '../components/BaseApplicationLayout'
import { ProjectDetailsSemantic } from '../components/ProjectDetails'
import FullscreenLoader from '../components/FullscreenLoader'
import FullScreenError from '../components/FullscreenError'
import Semantics from '../utils/semantics'
import { useOperation } from '../../library/services/ReactGenericOperation'
import { AuthenticationRequiredError } from '../utils/Errors'
import LoginRedirect from '../components/LoginRedirect'

const Project = () => {
  const { id } = useParams()

  const { genericOperationBuilder } = useAppContextState()
  
  // const getProjectDetailsOperation = genericOperationBuilder.fromKey(Semantics.vnd_jeera.terms.Project) -> breaks
  const getProjectDetailsOperation = genericOperationBuilder.fromKey(Semantics.vnd_jeera.terms.getProjectDetails)
  
  const { makeCall, isLoading, success, data, error } =
    useOperation(getProjectDetailsOperation, { [Semantics.vnd_jeera.terms.projectId]: id})

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => makeCall(), [])

  return <BaseApplicationLayout>
    {
      isLoading ? <FullscreenLoader />
        : error && error instanceof AuthenticationRequiredError ? <LoginRedirect />
        : error ? <FullScreenError error={error.message}/>
        : success ? <ProjectDetailsSemantic value={data} />
        : <p>Something unexpected happened. Please try again later.</p>
    }
  </BaseApplicationLayout>

}

export default Project