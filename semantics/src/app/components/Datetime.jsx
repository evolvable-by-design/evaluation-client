import React from 'react'
import { Text } from 'evergreen-ui'

import SemanticComponentBuilder from '../../library/services/SemanticComponentBuilder'

import { defaultSemanticComponentErrorHandler } from '../utils/Errors'

const DateTime = ({ value }) => <Text>{ new Date(value).toLocaleString('en-US') }</Text>

export const DateTimeSemanticBuilder = new SemanticComponentBuilder(
  { type: 'string', format: 'datetime' }, DateTime, {}, {}, {},
  defaultSemanticComponentErrorHandler('datetime')
)

export const DateTimeSemantic = DateTimeSemanticBuilder.build()

export default DateTime