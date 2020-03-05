import React from 'react'
import { Text } from 'evergreen-ui'

const DateTime = ({ value }) => <Text>{ new Date(value).toLocaleString('en-US') }</Text>

export default DateTime