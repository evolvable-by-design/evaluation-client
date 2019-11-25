import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'

import { useAppContextState } from '../context/AppContext'
import BaseApplicationLayout from '../components/BaseApplicationLayout'
import { ProjectDetailsSemantic } from '../components/ProjectDetails'
import FullscreenLoader from '../components/FullscreenLoader'
import FullScreenError from '../components/FullscreenError'
import Semantics from '../utils/semantics'
import { useOperation } from '../../library/services/ReactGenericOperation'

const GET_PROJECT_DETAILS_KEY = Semantics.vnd_jeera.terms.getProjectDetails

const Project = () => {
  const { id } = useParams()

  const { genericOperationBuilder } = useAppContextState()
  
  const getProjectDetailsOperation = genericOperationBuilder.fromKey(GET_PROJECT_DETAILS_KEY)
  
  const { makeCall, isLoading, success, data, error } =
    useOperation(getProjectDetailsOperation, { [Semantics.vnd_jeera.terms.projectId]: id})

  useEffect(() => { makeCall() }, [])

  return <BaseApplicationLayout>
    {
      isLoading ? <FullscreenLoader />
        : error ? <FullScreenError error={error.message}/>
        : success ? <ProjectDetailsSemantic value={data} />
        : <p>Something unexpected happened. Please try again later.</p>
    }
  </BaseApplicationLayout>

}

export default Project