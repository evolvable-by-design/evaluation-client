import React, { useState, useEffect } from 'react'
import { Button } from 'evergreen-ui'

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

  const operation = genericOperationBuilder.fromKey(Semantics.vnd_jeera.terms.listProjects)
  const { makeCall, isLoading, success, data, error } = useOperation(operation)

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
  const lastPage = semanticData.getRelation(Semantics.hydra.terms.last, 1)
  console.log(lastPage)
  return <>
    <h1>Debug</h1>

    { lastPage && <LastPage operation={lastPage.operation}/> }
  </>
}

function LastPage({operation}) {
  const { genericOperationBuilder } = useAppContextState()
  const op = genericOperationBuilder.fromOperation(operation)
  const { makeCall, isLoading, success, data, error } = useOperation(op)
  console.log(data)

  return <Button onClick={makeCall}>Last</Button>
}

export default Debug
