import { useEffect, useState, useMemo } from 'react';
import { useHistory } from 'react-router-dom';

import AuthService from '../services/AuthenticationService';
import HttpCaller from '../services/HttpCaller';
import SemanticData from '../services/SemanticData';

export const useFetch = (requestConfig, resultMapper, onSuccessCallback, onErrorCallback) => {
  const [data, setData] = useState(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(undefined);

  const history = useHistory();

  useEffect(
    () => {
      const fetch = async () => {
        setError(undefined);
        setIsLoading(true);
  
        if (requestConfig !== undefined && Object.keys(requestConfig).length !== 0) {
          try {
            const result = await HttpCaller.call(requestConfig);
            if (resultMapper) {
              setData(resultMapper(result))
            } else {
              setData(result.data || {})
            }
            if (onSuccessCallback !== undefined) { onSuccessCallback(data); }
          } catch (error) {
            setError(error.message);
            if (onErrorCallback !== undefined) { onErrorCallback(error); }

            if (error.response.status === 401) {
              AuthService.currentTokenWasRefusedByApi()
              history.push('/login')
            }
          }
          setIsLoading(false);
        } else {
          setIsLoading(false);
        }
      };
  
      fetch();
    }, [requestConfig, resultMapper, history]
  );

  return [data, isLoading, error];
};

export const useFetchWithContext = (requestConfig, operation, resultMapper, onSuccessCallback, onErrorCallback) =>
  useFetch(
    requestConfig,
    useMemo(() => getDataAndItsDescription(operation, resultMapper), [operation, resultMapper]),
    onSuccessCallback,
    onErrorCallback
  );

const getDataAndItsDescription = (operation, resultMapper) => (result) => {
  const responseSchema = operation ? operation.responses[result.status] : undefined;
  const resourceSchema = responseSchema ? responseSchema.content[result.headers['content-type'].split(';')[0]].schema : undefined;
  const data = resultMapper ? resultMapper(result) : result.data;
  return new SemanticData(data, resourceSchema, responseSchema)
};

export default useFetch;
