import React, { useEffect, useMemo, useState } from 'react'
import { Heading, Pane, Popover, Position, SearchInput } from 'evergreen-ui'

import ComponentResolver from '../../../library/services/ComponentResolver'

import { useAppContextState } from '../../context/AppContext'
import Semantics from '../../utils/semantics'
import SemanticData from '../../../library/services/SemanticData'

function ResourceIdInput({ schema, value, error, onChange, required }) {
  const idSemantics = ['@id', undefined].includes(schema['@type']) ? schema['@id'] : schema['@type']
  
  const { genericOperationBuilder, apiDocumentation } = useAppContextState()
  const [ possibilities, setPossibilities ] = useState()
  const [ search, setSearch ] = useState()
  const filteredPossibilities = useMemo(() => {
    if (search === undefined || search === '') {
      return possibilities || []
    } else {
      return possibilities.filter(p => Object.values(p.value).find(el => JSON.stringify(el).indexOf(search) !== -1))
    }
  }, [search, possibilities])

  useEffect(() => {
    async function fetch() {
      const possibilities = await fetchPossibilities(idSemantics, apiDocumentation, genericOperationBuilder)
      setPossibilities(possibilities)
    }
    fetch()
  }, [idSemantics, apiDocumentation, genericOperationBuilder])

  const selectedElement = useMemo(
    () => (possibilities || []).find(p => p.getValue(idSemantics) === value),
    [possibilities]
  )

  return <>
    { value && <Pane marginBottom={8} marginRight={8}>
      <Heading size={400} marginBottom={8}>Selected</Heading>
      <ComponentResolver semanticData={selectedElement} />
    </Pane>}
    <Pane marginBottom={8}>
      <Heading size={400} marginBottom={8}>Selection...</Heading>
      <Popover
        position={Position.BOTTOM_LEFT}
        content={({ close }) =>
          <Pane maxHeight={500} minWidth={360} paddingY='8px' overflow='scroll' display="flex" flexDirection="column">
            { filteredPossibilities.map(p =>
              <Pane padding={8} marginBottom={8} borderBottom='1px solid #ccc' onClick={() => { onChange(p.getValue(idSemantics)); close();}}>
                <ComponentResolver semanticData={p} />
              </Pane>
            ) }
          </Pane>
        }
      >
        <SearchInput placeholder="Search..." value={search} width="100%" onChange={e => setSearch(e.target.value)} />
      </Popover>
    </Pane>
  </>
}

// TODO: move to appropriate files
async function fetchPossibilities(idSemantics, apiDocumentation, genericOperationBuilder) {
  const resourceType = findResourceType(idSemantics)
  const operation = apiDocumentation.findOperationListing(resourceType)
  
  if (operation === undefined) return {} // unsucessful

  const genericOperation = genericOperationBuilder.fromOperation(operation)
  
  if (genericOperation.hasParameters()) return {} // unsucessful
  
  const result = await genericOperation.call()
  
  return result.value.map(val => new SemanticData(val, result.resourceSchema.items, undefined, result.apiDocumentation))
}

function findResourceType(idSemantics) {
  // TODO use the semantics to determine it, not this breakable logic
  if (idSemantics.endsWith('projectId')) {
    return Semantics.schema.terms.Project
  } else if (idSemantics.endsWith('taskId')) {
    return Semantics.vnd_jeera.terms.Task
  } else if (idSemantics.endsWith('userId')) {
    return Semantics.vnd_jeera.terms.UserDetails
  } else {
    return undefined
  }
}

export default ResourceIdInput