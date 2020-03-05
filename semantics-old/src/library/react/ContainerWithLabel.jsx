import React from 'react'
import { Pane, Heading, majorScale, minorScale } from 'evergreen-ui'

const ContainerWithLabel = ({label, children}) => 
  <Pane marginBottom={majorScale(1)}>
    <Heading size={400} marginBottom={minorScale(1)}>{label}</Heading>
    {children}
  </Pane>

/*
<div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      <p style={{width: '100%', marginRight: '8px', marginBottom: 0}}><b>{formatString(typeName)}</b></p>
      { Object.entries(otherDataValues).map(([k, v]) => <BasicLiteral label={k} key={k} value={v} />) }
    </div>
*/

export default ContainerWithLabel