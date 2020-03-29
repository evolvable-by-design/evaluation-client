import React, { useState, useEffect } from 'react'

import { useAppContextState } from '../../app/context/AppContext'
import BaseApplicationLayout from '../../app/components/layout/BaseApplicationLayout'
import FullscreenLoader from '../../app/components/basis/FullscreenLoader'
import FullScreenError from '../../app/components/basis/FullscreenError'
import Semantics from '../../app/utils/semantics'
import { useOperation } from '../../library/services/ReactGenericOperation'
import { AuthenticationRequiredError } from '../../app/utils/Errors'
import LoginRedirect from '../../app/components/basis/LoginRedirect'

const Debug = () => {

  const { genericOperationBuilder } = useAppContextState()

  const getProjectDetailsOperation = genericOperationBuilder.fromKey(Semantics.vnd_jeera.terms.getProjectDetails)
  
  const { makeCall, isLoading, success, data, error } =
    useOperation(getProjectDetailsOperation, { [Semantics.vnd_jeera.terms.projectId]: '0e4a7fdb-b97e-42bf-a657-a61d88efb737'})

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => makeCall(), [])

  return <BaseApplicationLayout>
    {
      isLoading ? <FullscreenLoader />
        : error && error instanceof AuthenticationRequiredError ? <LoginRedirect />
        : error ? <FullScreenError error={error.message}/>
        : success ? <DebugSemanticData semanticData={data} />
        : <p>Something unexpected happened. Please try again later.</p>
    }
  </BaseApplicationLayout>

}

function DebugSemanticData({ semanticData }) {
  const [ createdOn, setCreatedOn ] = useState()
  
  useEffect(() => {
    const apply = () => semanticData._getValueFromLinks(Semantics.schema.terms.createdOn).then(setCreatedOn)
    apply()
  }, [semanticData])

  return <p>Debuging semantic data {createdOn}</p>
}

export default Debug
