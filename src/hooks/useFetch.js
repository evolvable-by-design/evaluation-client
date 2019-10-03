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

  useEffect(
    () => {
      const fetch = async () => {
        setError(undefined);
        setIsLoading(true);
  
        if (axiosConfig !== undefined && Object.keys(axiosConfig).length !== 0) {
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
        }
      };
  
      fetch();
    }, [axiosConfig, resultMapper]
  );

  return [data, isLoading, error];
};

export const useFetchWithContext = (axiosConfig, operation, resultMapper) =>
  useFetch(
    axiosConfig,
    useMemo(() => getDataAndItsDescription(operation, resultMapper), [operation, resultMapper])
  );

const getDataAndItsDescription = (operation, resultMapper) => (result) => {
  const responseSchema = operation ? operation.responses[result.status] : undefined;
  const resourceSchema = responseSchema ? responseSchema.content[result.headers['content-type'].split(';')[0]].schema : undefined;
  const data = resultMapper ? resultMapper(result) : result.data;
  return new SemanticData(data, resourceSchema, responseSchema)
};

export default useFetch;
