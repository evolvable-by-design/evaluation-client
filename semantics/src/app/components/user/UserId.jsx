import React, { useEffect } from 'react'
import { Badge, Paragraph } from 'evergreen-ui'

import { useOperation } from '../../../library/services/ReactGenericOperation'

import LoginRedirect from '../basis/LoginRedirect'
import UserBadge from './UserBadge'
import { useAppContextState } from '../../context/AppContext'
import Semantics from '../../utils/semantics'
import { isExistingResourceId } from '../../utils/SemanticsUtils'

const UserId = ({ value, valueSemantics, noLabel }) => {
  // console.log(value)
  // console.log(valueSemantics)
  const { genericOperationBuilder } = useAppContextState()

  if (isExistingResourceId(valueSemantics.resourceSchema)) {
    const { operation, parameters } = genericOperationBuilder.fromId(value)
    return <FetchUser operation={operation} parameters={parameters} noLabel={noLabel} />
  } else if (valueSemantics.type === Semantics.vnd_jeera.terms.assignee) {
    const operation = genericOperationBuilder.fromKey(Semantics.vnd_jeera.terms.getUserDetails)
    return <FetchUser operation={operation} parameters={{ [Semantics.vnd_jeera.terms.userId]: value}} noLabel={noLabel} />
  } else {
    return <UserBadge username={value} noLabel />
  }
}

const FetchUser = ({ operation, parameters, noLabel }) => {
  const { makeCall, isLoading, data, error, userShouldAuthenticate } = useOperation(operation, parameters)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => makeCall(), [])
  
  if (userShouldAuthenticate) {
    return <LoginRedirect />
  } else if (isLoading) {
    return <Paragraph>Loading...</Paragraph>
  } else if (error || (!isLoading && !error && !data)) {
    return <Badge color="red" onClick={() => alert(error.getValue(Semantics.schema.terms.identifier))}>Error (click for more info)</Badge>
  } else {
    return <UserBadge username={data.getValue(Semantics.meb.terms.username)} noLabel={noLabel} />
  }
}

export default UserId
