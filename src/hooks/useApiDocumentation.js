import { useEffect, useState } from 'react';
import axios from 'axios';

import Config from '../config.json';

function useApiDocumentation() {
  const [documentation, setDocumentation] = useState(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(undefined);

  useEffect(() => {
    const fetchDocumentation = async () => {
      setError(undefined);
      setIsLoading(true);

      try {
        const result = await axios.options(Config.serverUrl);
        setDocumentation(result.data);
      } catch (error) {
        console.error(error);
        setError(error.message);
      }
      setIsLoading(false);
    };

    fetchDocumentation();
  }, []);

  return [documentation, isLoading, error];
};

export default useApiDocumentation;
