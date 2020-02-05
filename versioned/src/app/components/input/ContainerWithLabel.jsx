import React from 'react'
import { Pane, Heading, majorScale, minorScale } from 'evergreen-ui'

const ContainerWithLabel = ({label, children}) => 
  <Pane marginBottom={majorScale(1)}>
    <Heading size={400} marginBottom={minorScale(1)}>{label}</Heading>
    {children}
  </Pane>

export default ContainerWithLabel