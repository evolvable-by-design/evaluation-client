import * as JsonLDParser from './JsonLdParser';
import { mapObject } from '../utils/javascript-utils';

class DocumentationBrowser {

  constructor(documentation) {
    this.documentation = JsonLDParser.replaceAllId(documentation);
    console.log(this.documentation);
    this.semanticKeyMapping = JsonLDParser.findSemanticWithKeyMappings(documentation);
  }

  findOperation(target) {
    const operationFromId = this._findOperationWithId(target);
    if (operationFromId) {
      return operationFromId;
    }

    // const operationReturningTarget = this._findOperationThatReturns(target);
    // return operationReturningTarget;
    return undefined;
  }

  resolveParameters(operation) {
    const [route, path] = this._findPath(operation.id);

    if ()
    // TODO
    return undefined;
  }

  findRequestBodySchema(operationId) {
    const operation = this._findOperationWithId(operationId)
    
    if (operation && operation.requestBody) {
      const contents = operation.requestBody.content;
      const content = contents['application/json'] || contents[Object.keys(contents)[0]]
      return content.schema;
    }

    return undefined;
  }

  notContainsRequiredParametersWithoutDefaultValue(operation) {
    // TODO
    // return undefined;
    return true;
  }

  /**
   * Refine a given element of the documentation by resolving 
   * all references and semantics of the element and its children
   * 
   * @param {*} value an element of the documentation
   */
  _refine(value) {
    if (value instanceof Array) {
      return value.map(this._refine.bind(this))
    } else if (value instanceof Object) {
      if (value['$ref']) {
        return this._refine(this._resolveReference(value['$ref']))
      } else {
        return mapObject(value, (key, v) => {
          const refinedEl = this._refine(v);
          if ((key === 'parameters' || key === 'properties') && v instanceof Object && !(v instanceof Array)) {
            return [key, this._withSemanticsToProperties(refinedEl)];
          } else {
            return [key, refinedEl];
          }
        });
      }
    } else {
      return value;
    }
  }

  _findPath(operationId) {
    return Object.entries(this.documentation.paths)
      .find(([route, pathObject]) => Object.values(pathObject).find(operation => operation.id === operationId) !== undefined)
      .map(([route, pathObject]) => [ route, this._refine(pathObject) ]);
  }

  _withSemanticsToProperties(properties) {
    return mapObject(properties, (key, value) => {
      if (value instanceof Object && value['@id'] === undefined) {
        const semantic = this._findSemanticOfKeyword(key);
        if (semantic) { value['@id'] = semantic; } 
      }
      return [key, value]
    });
  }

  _findSemanticOfKeyword(keyword) {
    return Object.keys(this.semanticKeyMapping).find(key => this.semanticKeyMapping[key] === keyword);
  }

  _findOperationWithId(target) {
    // should be optimized
    const pathFound = Object.entries(this.documentation.paths)
      .find(([path, operations]) => Object.values(operations)
        .find(operation => operation['@id'] === target)
      );

    if (pathFound) {
      const [path, operations] = pathFound;
      const parametersOfPath = this._refine(operations['parameters']);
      const [verb, operation] = Object.entries(operations).find(([v, op]) => op['@id'] === target)

      let parameters = this._mergeOptionalArrays(parametersOfPath, operation.parameters);

      return {
        ...this._refine(operation),
        verb,
        url: path,
        parameters
      }
    } else {
      return undefined;
    }
  }

  _findOperationThatReturns(target) {
    return Object.values(this.documentation.paths)
      .filter(path => Object.values(path)
        .filter(operation => operation.responses)
        .find(operation => Object.values(operation.responses)
            .filter(response => response.content)
            .filter(response => response.content['application/json'])
            .map(response => response.content['application/json'])
            .filter(content => content.schema)
            .filter(content => {
              if (content.schema['$ref']) {
                const schemaName = this._resolveReferenceName(content.schema['$ref']);
                if (this.semanticKeyMapping[target] === schemaName) {
                  return true;
                }
              }

              const schema = content.schema['$ref'] ? this._resolveReference(content.schema['$ref']) : content.schema;
              return schema['@id'] === target
            })
        )
      )
  }

  _resolveComponent(component) {
    if (component instanceof Object && !(component instanceof Array)) {
      return component['$ref'] ? this._resolveReference(component['$ref']) : component;
    }

    return component;
  }

  _resolveReference(ref) {
    if (!ref.startsWith('#')) {
      throw new Error('Unhandled kind of reference:' + ref);
    }

    const fragments = ref.substring(2).split('/');
    const object = fragments.reduce((res, fragment) => res[fragment], this.documentation);
    if (!object['@id']) {
      object['@id'] = this._findSemanticOfKeyword(fragments[fragments.length - 1])
    }
    return object;
  }

  _resolveReferenceName(ref) {
    if (!ref.startsWith('#')) {
      throw new Error('Unhandled kind of reference:' + ref);
    }

    const fragments = ref.substring(1).split('/');
    return fragments[fragments.length-2];
  }

  _mergeOptionalArrays(arr1, arr2) {
    return !arr1 && !arr2 ? arr1 : (arr1 || []).concat(arr2 || [])
  }

}

export default DocumentationBrowser;