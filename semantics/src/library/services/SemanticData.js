/*
 * At the moment this class is only able to find elements in an object
 * with direct semantic match. It doesn't look at the OWL description
 * in order to leverage the "sameAs" property.
 * 
 * TODO: look deeper into the semantic
 */
import ajv from './Ajv'
import DocumentationBrowser from './DocumentationBrowser';
import { reduceObject } from '../../app/utils/javascriptUtils';
import GenericOperation from './GenericOperation';

class SemanticData {

  constructor(data, resourceSchema, responseSchema, apiDocumentation, httpCaller, originHttpResponse) {
    this.value = data;
    this.responseSchema = responseSchema
    this.apiDocumentation = apiDocumentation
    this.alreadyReadData = []
    this.alreadyReadRelations = []
    this.httpCaller = httpCaller
    this.originHttpResponse = originHttpResponse

    if (resourceSchema.oneOf) {
      const schema = resourceSchema.oneOf
        .sort((a, b) => (b.required ? b.required.length : 0) - (a.required ? a.required.length : 0))
        .find(schema => doesSchemaMatch(data, schema))
      this.type = schema ? schema['@id'] || schema.type || resourceSchema.type : undefined
      this.resourceSchema = schema
    } else {
      this.type = resourceSchema ? resourceSchema['@id'] || resourceSchema.type : undefined
      this.resourceSchema = resourceSchema
    }
  }

  isObject() { return this.resourceSchema ? this.resourceSchema.type === 'object' : this.value === Object(this.value) }
  isArray() { return this.resourceSchema ? this.resourceSchema.type === 'array' : this.value instanceof Array }
  isPrimitive() { return !this.isArray() && ! this.isObject(); }

  resetReadCounter() {  this.alreadyReadData = []; this.alreadyReadRelations = []; return this; }

  async get(semanticKey) {
    const maybeInnerValue = this._getInnerValue(semanticKey)

    if (maybeInnerValue) return maybeInnerValue

    return await this._getValueFromLinks(semanticKey)
  }

  _getInnerValue(semanticKey) {
    if (this.value === undefined) return undefined;

    if (this.isObject()) {
      const [key, schema] = this._findPathsToValueAndSchema(semanticKey)|| [undefined, undefined]
      if (key === undefined || schema === undefined) return undefined
      
      const value = key.includes('.') ? this.value[key.split('.')[0]][key.split('.')[1]] : this.value[key]
      if (value === undefined) return undefined
      
      if (!this.alreadyReadData.includes(key)) { this.alreadyReadData.push(key) }

      if (schema.type === 'array') {
        const responseBodySchema = this.apiDocumentation?.responseBodySchema(schema.items['@id'])
        return value.map(v => new SemanticData(v, schema.items, responseBodySchema, this.apiDocumentation, this.httpCaller, this.originHttpResponse))
      } else {
        return new SemanticData(value, schema, this.apiDocumentation?.responseBodySchema(schema['@id']), this.apiDocumentation, this.httpCaller, this.originHttpResponse)
      }
    } else if (this.isArray()) {
      // Not sure of this yet. This may be thought a bit more.
      return undefined
    } else {
      return this.type === semanticKey ? this : undefined;
    }
  }

  async _getValueFromLinks(semanticKey) {
    const resourcesContainingValue = this._getOperationsWithParentAffiliation()
      .filter(result => 
        result.operation.verb === 'get'
        && !(new GenericOperation(result.operation, this.apiDocumentation).isMissingRequiredParameters())
      )
      .map(result => { 
        const responseProperties = result.operation?.responses['200']?.content['application/json']?.schema?.properties
        const maybePropertyMatchingSemanticKey = Object.entries(responseProperties)
          .find(([key, schema]) => schema['@id'] === semanticKey)
        const key = maybePropertyMatchingSemanticKey ? maybePropertyMatchingSemanticKey[0] : undefined

        return {
          ...result,
          pathInResponse: key
        }
      })
      .filter(result => result.pathInResponse !== undefined)

    if (resourcesContainingValue.length === 0) {
      return undefined
    } else if (resourcesContainingValue.length > 1) {
      console.warn('Found more than one link containing a value for the searched property in SemanticData._getValueFromLinks')
      return undefined
    } else {
      const toInvoke = resourcesContainingValue[0]
      const linkedResourceData = await new GenericOperation(toInvoke.operation, this.apiDocumentation, this.httpCaller).call()
      return new SemanticData(
        linkedResourceData.value[toInvoke.pathInResponse],
        linkedResourceData.resourceSchema.properties[toInvoke.pathInResponse],
        undefined,
        this.apiDocumentation,
        this.httpCaller,
        this.originHttpResponse,
        linkedResourceData.originHttpResponse
      )
    }
  }

  _findPathsToValueAndSchema(semanticKey) {
    const result = Object.entries(this.resourceSchema.properties)
      .flatMap(([key, value]) => {
        if (value.type === 'object' && value['x-affiliation'] && value['x-affiliation'] === 'parent') {
          return Object.entries(value.properties).map(([pKey, pValue]) => [`${key}.${pKey}`, pValue])
        } else {
          return [[key, value]]
        }
      })
      .find(([key, value]) => value['@id'] !== undefined && value['@id'] === semanticKey);

    return result
  }

  // TODO: make use of this.get() instead of this._getInnerValue()
  getValue(semanticKey) {
    const semanticData = this._getInnerValue(semanticKey);

    if (semanticData !== undefined && semanticData instanceof Array) {
      return semanticData.map(s => s.value);
    } else if (semanticData !== undefined) {
      return semanticData.value;
    } else {
      return undefined;
    }
  }

  getOtherData() {
    const alreadyReadData = this.alreadyReadData
    const result = Object.entries(this.resourceSchema.properties)
      .filter(([key]) => !this.alreadyReadData.includes(key))
      .map(([key, property]) => [key, this._getInnerValue(property['@id'])])
      .filter(([key, value]) => value !== undefined)
      .reduce(reduceObject, {})
    this.alreadyReadData = alreadyReadData
    return result
  }

  isRelationAvailable(semanticRelation) {
    return this.getRelation(semanticRelation).length !== 0
  }

  getRelation(semanticRelation, maxRelationReturned) {
    const relations = this._getRelationFromSemantics(semanticRelation)

    if (maxRelationReturned === 1) {
      return relations.length > 0 ? relations[0] : undefined
    } else if (maxRelationReturned) {
      return relations.splice(0, 2)
    } else {
      return relations
    }
  }

  getRelations(semanticRelations) {
    return semanticRelations.map(rel => this.getRelation(rel)).reduce((acc, values) => acc.concat(values), [])
  }

  _getHeader(semanticKey) {
    const headers = this._normalizeHeaders()
    return Object.values(headers)
      .flatMap(value => {
        if (value instanceof Array) {
          return value.filter(v => v?.relation === semanticKey)
        } else if (value?.relation === semanticKey) {
          return [ value ]
        } else {
          return []
        }
      })
  }

  _getDataFromHeaders(semanticKey) {
    return this._getHeader(semanticKey)
      .map(result => new SemanticData(result.value, result.documentation, undefined, this.apiDocumentation, this.httpCaller, this.originHttpResponse))
  }

  _getRelationsFromHeaders(semanticKey) {
    return this._getHeader(semanticKey)
      .map(result => {
        const operationId = result?.operationId || result?.documentation?.operationId

        const operation = this.apiDocumentation.findOperationById(operationId)
        delete operation['parameters']
        delete operation['requestBody']

        return {
          key: result.relation.slice(result.relation.lastIndexOf('#') + 1),
          operation: {
            ...operation,
            url: result.value,
          }
        }
      })
  }

  _normalizeHeaders() {
    return Object.entries(this.originHttpResponse.headers)
      .map(([header, value]) => {
        const headerKey = Object.keys(this.responseSchema?.headers || {}).find(key => key.toLowerCase() === header.toLowerCase())
        const headerDocumentation = headerKey ? this.responseSchema?.headers[headerKey] : undefined

        if (header === 'link') { 
          const links = value.split(',')
            .map(entry => entry.trim())
            .map(entry => entry.slice(1, -1))
            .map(entry => entry.split(';')
              .map(s => s.trim())
              .reduce((accumulator, value, i) => {
                if (i === 0) {
                  accumulator['value'] = value
                  accumulator['documentation'] = headerDocumentation
                } else {
                  const [key, val] = value.split('=')
                  const correctedKey = key === 'rel' ? 'relation' : key
                  accumulator[correctedKey] = val.slice(1, -1)
                }
                return accumulator
              }, {})
            )
          return [ header, links ]
        } else {
          const relation = headerDocumentation ? headerDocumentation['@id'] : undefined
          return [ header, { value, relation, documentation: headerDocumentation }]
        }
      })
      .reduce((acc, [key, value]) => { acc[key] = value; return acc; }, {})
  }

  _getRelationFromSemantics(semanticRelation) {
    const relationsFromHypermediaControls = this._getRelationFromHypermediaControls(
      ([key, schema]) => schema['@relation'] === semanticRelation,
      true
    )

    const relationsFromHeaders = this._getRelationsFromHeaders(semanticRelation)
    return relationsFromHypermediaControls.concat(relationsFromHeaders)
  }

  _getRelationFromHypermediaControlKey(hypermediaControlKey, addToReadList) {
    return this._getRelationFromHypermediaControls(([key, schema]) => key === hypermediaControlKey, addToReadList)
  }

  _getOperationsWithParentAffiliation() {
    return this._getRelationFromHypermediaControls(([key, schema]) => schema['x-affiliation'] === 'parent', false)
  }

  _getRelationFromHypermediaControls(filterFct, addToReadList) {
    const responseSchemaLinks = this.responseSchema.links || {};
    const availableLinks = this.value._links || [];

    return Object.entries(responseSchemaLinks)
      .filter(filterFct)
      .map(([key, schema]) => {
        const operation = this.apiDocumentation.findOperationById(schema.operationId)
        if (operation === undefined) {
          console.warn(`Error found in the documentation: operation with id ${key} does not exist.`)
        }
        return [key, operation]
      })
      .filter(([key, operation]) => operation !== undefined)
      .filter(([key, operation]) => availableLinks.includes(key) || availableLinks.find(control => control['relation'] === key))
      .map(([key, operation]) => {
        const controlFromPayload = availableLinks[key]
          || availableLinks.find(control => control['relation'] === key)
        
        const requestBodySchema = DocumentationBrowser.requestBodySchema(operation)
        if (requestBodySchema && requestBodySchema.oneOf) {
          DocumentationBrowser.updateRequestBodySchema(
            operation,
            this._findClosestSchema(requestBodySchema.oneOf, controlFromPayload)
          )
        }

        const operationWithDefaultValues = this._addDefaultValuesToOperationSchema(controlFromPayload, operation)
        
        if (addToReadList && !this.alreadyReadRelations.includes(key)) {
          this.alreadyReadRelations.push(key)
        }
  
        return {key, operation: operationWithDefaultValues}
      })
  }

  getOtherRelations() {
    const others = this.value._links.map(l => l instanceof Object ? l.relation : l)
      .filter(key => !this.alreadyReadRelations.includes(key))
    
    return others.map(key => this._getRelationFromHypermediaControlKey(key, false)).filter(val => val[0] && val[1])
  }

  _addDefaultValuesToOperationSchema(hypermediaControl, operation) {
    if (hypermediaControl === undefined || hypermediaControl.parameters === undefined) return operation

    const op = Object.assign({}, operation)
    
    if (op.parameters) op.parameters.forEach(param => {
      if (hypermediaControl.parameters[param.name] !== undefined) {
        param.schema.default = hypermediaControl.parameters[param.name]
      }
    })
    const requestBodySchema = DocumentationBrowser.requestBodySchema(op)
    
    if (requestBodySchema && requestBodySchema.properties) {
      Object.entries(requestBodySchema.properties).forEach(([name, prop]) => {
        prop.default = hypermediaControl.parameters[name]
      })
    } 
    
    return op
  }

  _findClosestSchema(schemas, control) {
    // TODO look deeper into the schemas, don't limit to first level
    const controlProperties = Object.keys(control.parameters || {})
    const match = schemas
      .map(schema => {
        const matchingPropertiesCount = Object.keys(schema.properties || {})
          .filter(p => controlProperties.includes(p))
          .length
        return [schema, matchingPropertiesCount]
      })
      .sort((a, b) => b[1] - a[1])
      .map(([schema, matchingPropertiesCount]) => schema)

    if (match !== undefined && match.length > 0) return match[0]

    return schemas[0]
  }

}

// utility, file private functions
function doesSchemaMatch (value, schema) {
  const validate = ajv.compile(schema)
  return validate(value)
}

export default SemanticData;