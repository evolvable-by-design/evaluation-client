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
    
    this.type = resourceSchema ? resourceSchema['@id'] || resourceSchema.type : undefined;
    this.resourceSchema = resourceSchema;
    this.responseSchema = responseSchema;
    this.alreadyReadData = [];
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

    if (hypermediaControlKey !== undefined) {
      const schemaLinks = this.responseSchema.links || {};
      const notResolvedOperation = schemaLinks[hypermediaControlKey];
      
      const operation = apiDocumentation.findOperationById(notResolvedOperation.operationId)
      return [hypermediaControlKey, operation];
    } else {
      return [undefined, undefined];
    }
  }

  _findRelation(semanticRelation) {
    const schemaLinks = this.responseSchema.links || {};
    const hypermediaControl = Object.entries(schemaLinks)
      .find(([key, value]) => value['@relation'] === semanticRelation)

      if (hypermediaControl === undefined)
      return undefined;

    const hypermediaControlKey = hypermediaControl[0];
    const links = this.value._links || [];

    if (hypermediaControlKey !== undefined && links.includes(hypermediaControlKey)) {
      return hypermediaControl;
    } else {
      return [undefined, undefined];
    }
  }

}

export default SemanticData;