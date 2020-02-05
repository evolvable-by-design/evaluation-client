import React from 'react'
import { Avatar, Text, Pane } from 'evergreen-ui'

import { formatString } from '../../utils/javascriptUtils'

const UserBadge = ({ username, noLabel }) =>
  <Pane display='flex' direction='row' alignItems='center'>
    <Avatar name={ formatString(username)} size={26} />
    { !noLabel && <Text marginLeft='8px'>{username}</Text> }
  </Pane>

export default UserBadge