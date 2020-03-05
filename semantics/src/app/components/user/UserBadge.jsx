import React from 'react'
import { Avatar, Text, Pane } from 'evergreen-ui'

import SemanticComponentBuilder from '../../../library/services/SemanticComponentBuilder'

import { formatString } from '../../utils/javascriptUtils'
import Semantics from '../../utils/semantics'
import { defaultSemanticComponentErrorHandler } from '../../utils/Errors'


const UserBadge = ({ username, noLabel }) =>
  <Pane display='flex' direction='row' alignItems='center'>
    <Avatar name={ formatString(username)} size={26} />
    { !noLabel && <Text marginLeft='8px'>{username}</Text> }
  </Pane>


export const UserBadgeSemanticBuilder = new SemanticComponentBuilder(
  Semantics.vnd_jeera.terms.UserDetails,
  UserBadge,
  {
    username: Semantics.meb.terms.username,
  }, undefined, undefined,
  defaultSemanticComponentErrorHandler('user')
)

export const UserBadgeSemantic = UserBadgeSemanticBuilder.build()

export default UserBadge