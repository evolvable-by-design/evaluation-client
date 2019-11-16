import { NotFoundOperation } from '../../app/utils/Errors'
import { buildRequest} from '../utils/requestBuilder'

export class GenericOperation {

  constructor(operation, apiDocumentation, httpCaller) {
    if (operation === undefined || apiDocumentation === undefined) {
      throw new Error('GenericOperationResolver requires both operation and apiDocumentation')
    }

    this.operation = operation
    this.apiDocumentation = apiDocumentation
    this.httpCaller = httpCaller
  }

  async call(values, parameters) {
    return this.httpCaller.semanticCall(
      this.buildRequest(values, parameters),
      this.operation
    )
  }

  buildRequest(values, parameters) {
    // TODO: return details about missing params
    return buildRequest(
      this.apiDocumentation,
      this.operation,
      this.computeParameters(parameters),
      this.computeBodyValue(values)
    )
  }

  computeBodyValue(values) {
    return { ...this.getDefaultBodyValue(), ...(values || {}) }
  }

  computeParameters(parameters) {
    return { ...this.getDefaultParameters(), ...(parameters || {}) }
  }

  buildDefaultRequest() {
    return this.operation.verb === 'get' ? this.buildRequest({}, {}) : undefined
  }

  hasForm = () => this.operation.requestBody

  hasFilters = () => this.getParametersSchema() !== undefined

  getRequestBodySchema() {
    if (this.requestBodySchema === undefined && this.operation.requestBody) {
      this.requestBodySchema = this.apiDocumentation.requestBodySchema(this.operation)
    }
    return this.requestBodySchema
  }

  getDefaultBodyValue() {
    if (!this.hasForm()) return {}

    return Object.entries(this.getRequestBodySchema().properties)
      .filter(([name, value]) => value.default !== undefined)
      .reduce((acc, [name, value]) => {
        acc[name] = value.default
        return acc
      }, {})
  }

  getParametersSchema() {
    return this.operation.parameters
  }

  getDefaultParameters() {
    const defaultParameters = (this.getParametersSchema() || [])
      .filter(param => param.schema.default !== undefined)
      .reduce((acc, param) => { acc[param.name] = param.schema.default; return acc; }, {})

    return defaultParameters || {}
  }

}

export class GenericOperationBuilder {

  constructor(apiDocumentation, httpCaller) {
    this.apiDocumentation = apiDocumentation
    this.httpCaller = httpCaller
  }

  fromKey(actionKey) {
    const maybeOperation = this.apiDocumentation.findOperation(actionKey)

    if (maybeOperation === undefined) 
      throw new NotFoundOperation()
    
    return this.fromOperation(maybeOperation)
  }

  fromOperation(operation) {
    return new GenericOperation(operation, this.apiDocumentation, this.httpCaller)
  }

}

export default GenericOperation
