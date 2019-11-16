import { buildRequest } from '../utils/requestBuilder'
import HttpCaller from './HttpCaller'

class GenericOperationCaller {

  constructor(operation, apiDocumentation, requestBodySchema, defaultBodyValue, defaultParameters) {
    this.operation = operation
    this.apiDocumentation = apiDocumentation
    this.requestBodySchema = requestBodySchema
    this.defaultBodyValue = defaultBodyValue
    this.defaultParameters = defaultParameters
    this.httpCaller = new HttpCaller(apiDocumentation.getServerUrl())
  }

  computeBodyValue(values) {
    return { ...this.defaultBodyValue, ...(values || {}) }
  }

  computeParameters(parameters) {
    return { ...this.defaultParameters, ...(parameters || {}) }
  }

  buildDefaultRequest() {
    return this.operation.verb === 'get' ? buildRequest({}, {}) : undefined
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

  async call(values, parameters, history) {
    return this.httpCaller.semanticCall(
      this.buildRequest(values, parameters),
      this.operation,
      undefined,
      history
    )
  }

}

export default GenericOperationCaller
