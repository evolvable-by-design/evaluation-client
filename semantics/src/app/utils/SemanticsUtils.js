export function isExistingResourceId(value) {
  // TODO: look into the semantics of the @type to determine if its an @id instead of writing `valueSemantics.resourceSchema['@type'].endsWith('Id')`
  if (value === undefined) return undefined
  
  return value === '@id' || value.endsWith('Id')
}
