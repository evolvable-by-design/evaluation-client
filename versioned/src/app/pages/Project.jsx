import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'

import BaseApplicationLayout from '../components/layout/BaseApplicationLayout'
import ProjectDetails from '../components/project/ProjectDetails'
import FullscreenLoader from '../components/basis/FullscreenLoader'
import FullScreenError from '../components/basis/FullscreenError'
import { AuthenticationRequiredError } from '../utils/Errors'
import LoginRedirect from '../components/basis/LoginRedirect'
import useFetch from '../hooks/useFetch'
import ProjectService from '../services/ProjectService'

const Project = () => {
  const { id } = useParams()
  const { makeCall, isLoading, success, data, error } = useFetch(() => ProjectService.findOne(id))
  useEffect(() => makeCall(), [])

  return <BaseApplicationLayout>
    {
      isLoading ? <FullscreenLoader />
        : error && error instanceof AuthenticationRequiredError ? <LoginRedirect />
        : error ? <FullScreenError error={error.message}/>
        : success ? <ProjectDetails projectId={id} title={data.name} isArchived={data.isArchived} refreshProjectFct={makeCall} />
        : <p>Something unexpected happened. Please try again later.</p>
    }
  </BaseApplicationLayout>

}

export default Project