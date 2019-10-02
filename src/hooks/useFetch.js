import { useEffect, useState, useMemo } from 'react';
import axios from 'axios';

import Config from '../config';
import SemanticData from '../services/SemanticData';

const axiosInstance = axios.create({
  baseURL: Config.serverUrl
});

export function useFetch(axiosConfig, resultMapper) {
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
            setData(resultMapper(result))
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

export const useFetchWithContext = (axiosConfig, operation, resultMapper) => {
  const [data, isLoading, error] = useFetch(
    axiosConfig,
    useMemo(() => getDataAndItsDescription(operation, resultMapper), [operation, resultMapper])
  );

  return data !== undefined
    ? [ new SemanticData(data.data, data.schema), isLoading, error ]
    : [ undefined, isLoading, error ];
};

const getDataAndItsDescription = (operation, resultMapper) => (result) => {
  const schema = operation ? operation.responses[result.status].content[result.headers['content-type'].split(';')[0]].schema : undefined;
  const data = resultMapper ? resultMapper(result) : result.data;
  return { data, schema }
};

export default useFetch;
