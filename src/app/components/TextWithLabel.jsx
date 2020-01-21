import React from 'react'
import { Paragraph } from 'evergreen-ui'

import ContainerWithLabel from './ContainerWithLabel'

const TextWithLabel = ({label, children}) => 
  <ContainerWithLabel label={label}>
    <Paragraph>{children}</Paragraph>
  </ContainerWithLabel>

export default TextWithLabel