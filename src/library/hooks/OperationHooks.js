import { useCallback, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';

export function useOperation(genericOperationCaller) {
  const [parameters, setParameters] = useState(genericOperationCaller.defaultParameters)
  const [formValues, setFormValues] = useState(genericOperationCaller.defaultBodyValue)
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
        const data = await genericOperationCaller.call(formValues, parameters, history)
        setData(data)
      } catch (error) {
        setError(error)
      } finally {
        setIsLoading(false)
      }
    }

    call()
  }, [genericOperationCaller, parameters, formValues, history])

  return { makeCall, isLoading, success, data, error, parameters, setParameters, formValues, setFormValues }
}
