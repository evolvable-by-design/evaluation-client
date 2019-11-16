import { useCallback, useMemo, useState } from 'react'

import GenericFilters from '../components/GenericFilters';
import GenericForm from '../components/GenericForm';

export function useForm(genericOperation) {
  const [values, setValues] = useState(genericOperation.getDefaultBodyValue())
  const [errors, setErrors] = useState({})

  const bodySchema = genericOperation.getRequestBodySchema()
  if (bodySchema) {
    return [GenericForm({bodySchema, values, setValues, errors, setErrors}), values, errors]
  } else {
    return [null, values, errors]
  }
}

export function useFilters(genericOperation) {
  const [values, setValues] = useState(genericOperation.getDefaultParameters())
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

export function useOperation(genericOperation) {
  const [form, values] = useForm(genericOperation)
  const [filters, parameters] = useFilters(genericOperation)

  const { makeCall, isLoading, success, data, error } = useCaller(values, parameters, genericOperation.call.bind(genericOperation))

  return { form, filters, makeCall, isLoading, success, data, error, parameters, values }
}
