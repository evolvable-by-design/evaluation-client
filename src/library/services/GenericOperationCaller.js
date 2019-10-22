import { useCallback, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';

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

  useOperation() {
    const [parameters, setParameters] = useState(this.defaultParameters)
    const [formValues, setFormValues] = useState(this.defaultBodyValue)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState()
    const [data, setData] = useState()
    const history = useHistory()
    const [callAlreadyTriggered, setCallAlreadyTriggered] = useState(false)
    const success = useMemo(() => data !== undefined || (callAlreadyTriggered && !isLoading && error === undefined), [callAlreadyTriggered, isLoading, error, data])

    const makeCall = useCallback(() => {
      const call = async () => {
        setIsLoading(true)
        setCallAlreadyTriggered(true)
        try {
          const data = await this.call(formValues, parameters, history)
          setData(data)
        } catch (error) {
          setError(error)
        } finally {
          setIsLoading(false)
        }
      }
  
      call()
    }, [this, parameters, formValues, history])
  
    return { makeCall, isLoading, success, data, error, parameters, setParameters, formValues, setFormValues }
  }

  getCallerFunction(values, parameters, successCallback, errorCallback) {
    return (history) => this.call(values, parameters, history).then(successCallback).catch(errorCallback)
  }

}

export default GenericOperationCaller
