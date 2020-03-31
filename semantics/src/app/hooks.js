import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import qs from 'qs'

export function useQuery() {
  return qs.parse(useLocation().search.substring(1))
}

export function useAsync(fct, dep) {
  if (!dep) {
    console.warn('useAsync was not provided a dependency array. If no dependency is needed, please provide an empty array.')
  }

  const [ data, setData ] = useState()
  const [ error, setError ] = useState()

  useEffect(() => {
    let unmounted = false

    const toExecute = async () => {
      if (fct) {
        const result = fct()

        if (result !== undefined) {
          result
            .then(result => { if (!unmounted) { setData(result) }})
            .catch(err => { if (!unmounted) { setError(err) }})
        }
      }
    }

    toExecute()

    return () => { unmounted = true }
  }, dep)

  return [ data, error ]
}
