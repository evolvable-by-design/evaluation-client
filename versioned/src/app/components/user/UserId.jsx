import React, { useEffect } from 'react'
import { Spinner } from 'evergreen-ui'

import useFetch from '../../hooks/useFetch'
import UserService from '../../services/UserService'

import UserBadge from './UserBadge'

const UserId = ({ id, noLabel }) => {
  const { makeCall, isLoading, data: user } = useFetch(() => UserService.getUserFromId(id))
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