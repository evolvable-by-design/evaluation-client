import { useMemo, useState } from 'react'

import { AuthenticationRequiredError } from '../utils/Errors'

const useRelation = (semanticData, apiDocumentation, relations) => {
  const [foundAuthOperations, setFoundAuthOperations] = useState(false)
  
  const result = useMemo(() => {
    if (semanticData === undefined)
      return [relations instanceof Array ? {} : undefined, false];
  
    if (relations instanceof Array) {
      return _findRelationsArray(semanticData, apiDocumentation, relations, setFoundAuthOperations)
    } else if (relations instanceof Object) {
      return _findRelationsObject(semanticData, apiDocumentation, relations, setFoundAuthOperations)
    } else {
      return _findRelationPrimitive(semanticData, apiDocumentation, relations, setFoundAuthOperations)
    }
  }, [semanticData, apiDocumentation, relations])

  return [result, foundAuthOperations]
}

const _findRelationsArray = (semanticData, apiDocumentation, relations, setFoundAuthOperations) =>
  relations.reduce(
    (acc, semanticKey) => acc[semanticKey] = _findRelationPrimitive(semanticData, apiDocumentation, semanticKey, setFoundAuthOperations),
    {}
  )

const _findRelationsObject = (semanticData, apiDocumentation, relations, setFoundAuthOperations) =>
  Object.entries(relations).reduce(
    (acc, [key, semanticKey]) => acc[key] = _findRelationPrimitive(semanticData, apiDocumentation, semanticKey, setFoundAuthOperations),
    {}
  )

function _findRelationPrimitive(semanticData, apiDocumentation, relation, setFoundAuthOperations) {
  try {
    return semanticData.getRelation(relation, apiDocumentation)
  } catch (error) {
    if (error instanceof AuthenticationRequiredError) {
      setFoundAuthOperations(true)
    } else {
      console.error(error)
    }

    return undefined
  }
}

export default useRelation