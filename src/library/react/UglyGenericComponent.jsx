import React from 'react'
import { formatString } from '../../app/utils/javascriptUtils'

const UglyGenericComponent = ({semanticData}) => {
  const typeName = typeNameFromSemanticUrl(semanticData.type)
  return <BasicLiteral label={typeName} value={semanticData.value} />
}

const BasicLiteral = ({label, value}) => {
  if (typeof value === 'object') {
    return <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      <p style={{width: '100%', marginRight: '8px', marginBottom: 0}}><b>{formatString(label)}</b></p>
      { Object.entries(value).map(([k, v]) => <BasicLiteral label={k} key={k} value={v} />) }
    </div>
  } else {
    return <div style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
      <p style={{width: '30%', marginRight: '8px'}}><b>{formatString(label)}</b></p>
      {
        typeof value === 'array'
          ? <ul>{ value.map(v => <li key={v}>{v}</li>) }</ul>
          : <p>{value}</p>
      }
    </div>
  }
}

function typeNameFromSemanticUrl(s) {
  const lastIndexOfSlash = s.lastIndexOf('/')
  const lastIndexOfPound = s.lastIndexOf('#')

  if (lastIndexOfSlash == -1 && lastIndexOfPound == -1) {
    return s
  } else {
    return s.substring(Math.max(lastIndexOfSlash, lastIndexOfPound) + 1)
  }
}

export default UglyGenericComponent