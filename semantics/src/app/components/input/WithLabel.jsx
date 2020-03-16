import React from 'react'
import { Heading, Pane, majorScale } from 'evergreen-ui'

import { capitalize, spaceCamelCaseWord } from '../../utils/javascriptUtils'

const WithLabel = ({label, required, children}) => 
  <Pane width="100%" display="flex" flexDirection="row" marginBottom={majorScale(3)} alignItems="flex-start">
    <FormLabel label={label} required={required} />
    <Pane width="100%" >
      {children}
    </Pane>
  </Pane>

const FormLabel = ({label, required}) => 
  <Pane width={majorScale(15)} marginRight={majorScale(3)}>
    <Heading size={400}>{spaceCamelCaseWord(capitalize(label))}{required ? '*' : ''}</Heading>
  </Pane>

  export default WithLabel