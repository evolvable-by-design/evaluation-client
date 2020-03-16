import React from 'react'
import { Badge, ListItem, Paragraph, Pill, UnorderedList } from 'evergreen-ui'

import { formatString } from '../../app/utils/javascriptUtils'

import SemanticData from './SemanticData'
import { useLibraryContextState } from '../react/LibraryContext'
import ContainerWithLabel from '../react/ContainerWithLabel'

function ComponentResolver({ semanticData }) {
  const { components, GenericComponent } = useLibraryContextState()

  if (semanticData instanceof Array) {
    return <ForArray array={semanticData} />
  } else {
    const MaybeComponent = components
        .find(semanticComponent => semanticComponent.canDisplay(semanticData.type, semanticData.resourceSchema.format))
        ?.build()
      
    if (MaybeComponent) {
      return <MaybeComponent value={semanticData} />
    } else if (GenericComponent) {
      return <GenericComponent semanticData={semanticData} />
    } else {
      return <UglyGenericComponent semanticData={semanticData}/>
    }
  }
}

const UglyGenericComponent = ({semanticData}) => {
  if (semanticData.isObject()) {
    return <ForObject semanticData={semanticData} />
  } else if (semanticData.isArray()) {
    return <ForArray array={semanticData} />
  } else {
    return <BasicLiteral value={semanticData.value} />
  }
}

const ForObject = ({semanticData}) => {
  const typeName = typeNameFromSemanticUrl(semanticData.type)
  semanticData.resetReadCounter()
  const otherData = semanticData.getOtherData()

  return <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
    <p style={{width: '100%', marginRight: '8px', marginBottom: 0}}><b>{formatString(typeName)}</b></p>
    { Object.entries(otherData).map(([k, v]) => 
      <ContainerWithLabel key={k} label={formatString(k)}>
        <ComponentResolver semanticData={v} />
      </ContainerWithLabel>
    ) }
  </div>
}

const ForArray = ({array}) => {
  if (
    (array instanceof Array && array.find(el => isLiteral(el.type)) !== undefined)
    || (array instanceof SemanticData && isLiteral(array.resourceSchema.items.type))
  ) {
    const values = array instanceof SemanticData
      ? array.value
      : array.map(el => el instanceof SemanticData ? el.value : el)
    return <UnorderedList>{ values.map(v => <ListItem key={v}>{v}</ListItem>) }</UnorderedList>
  } else {
    return <div>
      { array.map(semanticData =>
        <ComponentResolver key={JSON.stringify(semanticData.value)} semanticData={semanticData}/>)
      }
    </div>
  }
}

const BasicLiteral = ({value}) => <Paragraph>
  { typeof value === 'boolean'
      ? (value ? <Badge color="green">Yes</Badge> : <Badge color="red">No</Badge>)
      : typeof value === 'number' ? <Pill display="inline-flex" margin={8}>{value}</Pill>
      : value
  }
</Paragraph>

function typeNameFromSemanticUrl(s) {
  const lastIndexOfSlash = s.lastIndexOf('/')
  const lastIndexOfPound = s.lastIndexOf('#')

  if (lastIndexOfSlash === -1 && lastIndexOfPound === -1) {
    return s
  } else {
    return s.substring(Math.max(lastIndexOfSlash, lastIndexOfPound) + 1)
  }
}

function isLiteral(type) {
  return [ 'boolean', 'number', 'string', 'bigint' ].includes(type)
}

export default ComponentResolver;