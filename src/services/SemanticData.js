/*
 * At the moment this class is only able to find elements in an object
 * with direct semantic match. It doesn't look at the OWL description
 * in order to leverage the "sameAs" property.
 * 
 * TODO: look deeper into the semantic 
 */
class SemanticData {

  constructor(data, schema) {
    this.value = data;
    this.type = schema['@id'] || schema.type;
    this.schema = schema;
    this.alreadyReadData = [];
  }

  isObject() { return this.schema.type === 'object'; }
  isArray() { return this.schema.type === 'array'; }
  isPrimitive() { return !this.isArray() && ! this.isObject(); }

  get(semanticKey) {
    if (this.value === undefined) return undefined;

    if (this.isObject()) {
      const result = Object.entries(this.schema.properties)
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

}

export default SemanticData;