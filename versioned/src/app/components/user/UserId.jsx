import React, { useEffect } from 'react'
import { Spinner } from 'evergreen-ui'

import useFetch from '../../hooks/useFetch'
import HttpClient from '../../services/HttpClient'

import UserBadge from './UserBadge'

const UserId = ({ id, noLabel }) => {
  const { makeCall, isLoading, data: user } = useFetch(() => HttpClient().get(id).then(res => res.data))
  useEffect(makeCall, [])

  if (user) {
    return <UserBadge username={user.username} noLabel={noLabel} />
  } else if (isLoading) {
    return <Spinner size={16} />
  } else  {
    return null
  }
}

export default UserId