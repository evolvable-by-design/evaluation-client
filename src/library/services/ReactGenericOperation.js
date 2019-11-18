import { useCallback, useMemo, useState } from 'react'

import GenericFilters from '../components/GenericFilters';
import GenericForm from '../components/GenericForm';
import { filterObjectKeys } from '../../app/utils/javascriptUtils'

export function useForm(genericOperation, defaultValues) {
  const [values, setValues] = useState({ ...genericOperation.getDefaultBodyValue(), ...(defaultValues || {}) })
  const [errors, setErrors] = useState({})

  const bodySchema = genericOperation.getRequestBodySchema()
  if (bodySchema) {
    return [GenericForm({bodySchema, values, setValues, errors, setErrors}), values, errors]
  } else {
    return [null, values, errors]
  }
}

export function useFilters(genericOperation, defaultValues) {
  const [values, setValues] = useState({ ...genericOperation.getDefaultParameters(), ...defaultValues })
  const [errors, setErrors] = useState({})

  const parametersSchema = genericOperation.getParametersSchema()
  if (parametersSchema) {
    return [GenericFilters({parameters: parametersSchema, values, setValues, errors, setErrors}), values, errors]
  } else {
    return [null, values, errors]
  }
}

export function useCaller(values, parameters, callFct) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState()
  const [data, setData] = useState()
  const [callAlreadyTriggered, setCallAlreadyTriggered] = useState(false)
  const success = useMemo(() => data !== undefined || (callAlreadyTriggered && !isLoading && error === undefined), [callAlreadyTriggered, isLoading, error, data])

  const makeCall = useCallback(() => {
    const call = async () => {
      setIsLoading(true)
      setCallAlreadyTriggered(true)
      try {
        const data = await callFct(values, parameters)
        setData(data)
      } catch (error) {
        setError(error)
      } finally {
        setIsLoading(false)
      }
    }

    call()
  }, [callFct, parameters, values])

  return { makeCall, isLoading, success, data, error }
}

export function useOperation(genericOperation, providedValues) {
  const requestBodyKeys = genericOperation.getRequestBodyKeys()
  const defaultValues = mapProvidedValueToOperationParameter(providedValues, requestBodyKeys)

  const parameterKeys = genericOperation.getParameterKeys()
  const defaultParameters = mapProvidedValueToOperationParameter(providedValues, parameterKeys)

  const [form, values] = useForm(genericOperation, defaultValues)
  const [filters, parameters] = useFilters(genericOperation, defaultParameters)

  const { makeCall, isLoading, success, data, error } = useCaller(values, parameters, genericOperation.call.bind(genericOperation))

  return { form, filters, makeCall, isLoading, success, data, error, parameters, values }
}

function mapProvidedValueToOperationParameter(values, keys) {
  const valuesK = Object.keys(values || {})
  const res = {}
  Object.entries(keys).forEach(([key, semanticKey]) => {
    if (valuesK.includes(key)) {
      res[key] = values[key]
    } else if (valuesK.includes(semanticKey)) {
      res[key] = values[semanticKey]
    }
  })
  return res
}
