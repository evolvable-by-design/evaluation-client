import { useEffect, useState } from 'react';
import axios from 'axios';

import Config from '../config';

const axiosInstance = axios.create({
  baseURL: Config.serverUrl
});

function useFetch(axiosConfig, resultMapper) {
  const [data, setData] = useState(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(undefined);

  useEffect(() => {
    const fetchDocumentation = async () => {
      setError(undefined);
      setIsLoading(true);

      if (axiosConfig) {
        try {
          const result = await axiosInstance(axiosConfig);
          if (resultMapper) {
            setData(resultMapper(result.data))
          } else {
            setData(result.data)
          }
        } catch (error) {
          console.error(error);
          setError(error.message);
        }
        setIsLoading(false);
      } else {
        setIsLoading(false);
        setError('The API does not provide the required operation.');
      }
    };

    fetchDocumentation();
  }, [axiosConfig, resultMapper]);

  return [data, isLoading, error];
};

export default useFetch;
