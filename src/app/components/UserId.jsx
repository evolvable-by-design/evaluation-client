import React, { useEffect } from 'react'
import { Badge, Paragraph } from 'evergreen-ui'

import { useOperation } from '../../library/services/ReactGenericOperation'

import LoginRedirect from './LoginRedirect'
import UserBadge from './UserBadge'
import { useAppContextState } from '../context/AppContext'
import Semantics from '../utils/semantics'

const UserId = ({ value, valueSemantics, noLabel }) => {
  console.log(value)
  console.log(valueSemantics)
  // TODO adapt to make use of technical ids

  if (valueSemantics.resourceSchema['@type'] === '@id') {
    return <FetchUser userId={value} noLabel={noLabel} />
  } else {
    return <Paragraph>{value}</Paragraph>
  }
}

const FetchUser = ({ userId, noLabel }) => {
  const { genericOperationBuilder } = useAppContextState()
  const { operation, parameters } = genericOperationBuilder.fromId(userId)
  const { makeCall, isLoading, data, error, userShouldAuthenticate } = useOperation(operation, parameters)

  useEffect(() => makeCall(), []) // onInit
  
  if (userShouldAuthenticate) {
    return <LoginRedirect />
  } else if (isLoading) {
    return <Paragraph>Loading...</Paragraph>
  } else if (error || (!isLoading && !error && !data)) {
    return <Badge color="red" onClick={() => alert(error)}>Error (click for more info)</Badge>
  } else {
    return <UserBadge username={data.getValue(Semantics.meb.terms.username)} noLabel={noLabel} />
  }
}

export default UserId