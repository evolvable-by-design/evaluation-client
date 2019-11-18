/*
 * At the moment this class is only able to find elements in an object
 * with direct semantic match. It doesn't look at the OWL description
 * in order to leverage the "sameAs" property.
 * 
 * TODO: look deeper into the semantic 
 */
class SemanticData {

  constructor(data, resourceSchema, responseSchema) {
    this.value = data;
    
    this.type = resourceSchema ? resourceSchema['@id'] || resourceSchema.type : undefined
    this.resourceSchema = resourceSchema
    this.responseSchema = responseSchema
    this.alreadyReadData = []
    this.alreadyReadRelations = []
  }

  isObject() { return this.resourceSchema.type === 'object'; }
  isArray() { return this.resourceSchema.type === 'array'; }
  isPrimitive() { return !this.isArray() && ! this.isObject(); }

  get(semanticKey) {
    if (this.value === undefined) return undefined;

    if (this.isObject()) {
      const result = Object.entries(this.resourceSchema.properties)
        .find(([key, value]) => value['@id'] !== undefined && value['@id'] === semanticKey);
      const [key, schema] = result || [undefined, undefined];
      if (key && schema) {
        this.alreadyReadData.push(key);
        const value = this.value[key];
        if (schema.type === 'array') {
          return value.map(v => new SemanticData(v, schema.items));
        } else {
          return new SemanticData(value, schema);
        }
      } else {
        return undefined;
      }
    } else if (this.isArray()) {
      // Not sure of this yet. This may be thought a bit more.
      return undefined;
    } else {
      return this.type === semanticKey ? this : undefined;
    }
  }

  getValue(semanticKey) {
    const semanticData = this.get(semanticKey);

    if (semanticData !== undefined && semanticData instanceof Array) {
      return semanticData.map(s => s.value);
    } else if (semanticData !== undefined) {
      return semanticData.value;
    } else {
      return undefined;
    }
  }

  isRelationAvailable(semanticRelation) {
    return this._findRelation(semanticRelation) !== [undefined, undefined];
  }

  getRelation(semanticRelation, apiDocumentation) {
    const hypermediaControl = this._findRelation(semanticRelation);
    const hypermediaControlKey = hypermediaControl[0];
    return this._getRelation(hypermediaControlKey, apiDocumentation, true)
  }

  _getRelation(hypermediaControlKey, apiDocumentation, addToReadList) {
    if (hypermediaControlKey !== undefined) {
      const linksSchema = this.responseSchema.links || {};
      const notResolvedOperation = linksSchema[hypermediaControlKey];
      
      const operation = apiDocumentation.findOperationById(notResolvedOperation.operationId)

      if (operation === undefined) {
        console.warn(`Error found in the documentation: operation with id ${hypermediaControlKey} does not exist.`)
        return [undefined, undefined]
      }

      const links = this.value._links || []
      const controlFromPayload = links[hypermediaControlKey]
        || links.find(control => control['relation'] === hypermediaControlKey)

      if (controlFromPayload && controlFromPayload['parameters']) {
        Object.entries(controlFromPayload['parameters']).forEach(([key, value]) => {
          const param = operation['parameters'].find(p => p.name === key)
          if (param) {
            param.schema['default'] = value
          } else {
            operation['parameters'].push({name: key, schema: { default: value}})
          }
        })
      }

      if (addToReadList && !this.alreadyReadRelations.includes(hypermediaControlKey)) {
        this.alreadyReadRelations.push(hypermediaControlKey)
      }

      return [hypermediaControlKey, operation];
    } else {
      return [undefined, undefined];
    }
  }

  getOtherRelations(apiDocumentation) {
    const others = this.value._links.map(l => l instanceof Object ? l.relation : l)
      .filter(key => !this.alreadyReadRelations.includes(key))
    
    return others.map(key => this._getRelation(key, apiDocumentation, false)).filter(val => val[0] && val[1])
  }

  _findRelation(semanticRelation) {
    const schemaLinks = this.responseSchema.links || {};
    const hypermediaControl = Object.entries(schemaLinks)
      .find(([key, value]) => value['@relation'] === semanticRelation)

    if (hypermediaControl === undefined)
      return undefined;

    const hypermediaControlKey = hypermediaControl[0];

    const links = this.value._links || [];
    const isInPayload = links.includes(hypermediaControlKey)
      || links.find(control => control['relation'] === hypermediaControlKey)


    if (hypermediaControlKey !== undefined && isInPayload) {
      return hypermediaControl;
    } else {
      return [undefined, undefined];
    }
  }

}

export default SemanticData;