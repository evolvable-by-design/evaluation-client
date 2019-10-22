import { useEffect, useState } from 'react' 

import ApiDocumentationFetcher from '../services/ApiDocumentationFetcher'

const useApiDocumentation = (serverUrl) => {
  const [documentation, setDocumentation] = useState(undefined)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(undefined)

  useEffect(() => {
    setIsLoading(true)
    ApiDocumentationFetcher.fetch(serverUrl)
      .then(setDocumentation)
      .catch(setError)
      .finally(() => setIsLoading(false))
  }, []);

  return [documentation, isLoading, error]
}

export default useApiDocumentation