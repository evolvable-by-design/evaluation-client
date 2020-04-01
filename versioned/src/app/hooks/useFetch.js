import { useCallback, useState } from 'react'

function useFetch(fct) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState()
  const [success, setSuccess] = useState(false)
  const [data, setData] = useState()

  const makeCall = useCallback((overridingFct) => {
    const call = async () => {
      setIsLoading(true)
      try {
        const data = overridingFct ? await overridingFct() : await fct()
        setData(data)
        setSuccess(true)
        setError(undefined)
      } catch (error) {
        setData(undefined)
        setSuccess(false)
        setError(error)
      } finally {
        setIsLoading(false)
      }
    }

    call()
  }, [fct])

  return { makeCall, isLoading, success, data, error }
}

export default useFetch