import { useEffect, useState, useMemo } from 'react';
import { useHistory } from 'react-router-dom';

import Config from '../../config'
import HttpCaller from '../services/HttpCaller';

export const useFetch = (requestConfig, resultMapper, onSuccessCallback, onErrorCallback) => {
  const [data, setData] = useState(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(undefined);

  const history = useHistory();

  const httpCaller = useMemo(() => new HttpCaller(Config.serverUrl, history), [history])

  useEffect(
    () => {
      const fetch = async () => {
        setError(undefined);
        setIsLoading(true);

        try {
          const result = await httpCaller.call(requestConfig)
          const data = resultMapper !== undefined ? resultMapper(result) : result.data
          setData(data)
          if (onSuccessCallback !== undefined) { onSuccessCallback(data) }
        } catch (error) {
          console.error(error)
          setError(error.message);
          if (onErrorCallback !== undefined) { onErrorCallback(error) }
        }

        setIsLoading(false);
      };
  
      fetch();
    }, [requestConfig, resultMapper, history, onSuccessCallback, onErrorCallback, httpCaller]
  );

  return [data, isLoading, error];
};

export const useFetchPromise = (requestConfig, resultMapper) => {
  const [data, isLoading, error] = useFetch(requestConfig, resultMapper)

  const promise = useMemo(
    () => new Promise((resolve, reject) => data ? resolve(data) : reject(error)),
    [data, error]
  )

  return [promise, isLoading]
}

export const useFetchWithContext = (requestConfig, operation, resultMapper, onSuccessCallback, onErrorCallback) =>
  useFetch(
    requestConfig,
    useMemo(() => (result) =>
      HttpCaller.getDataAndItsDescription(result, operation, resultMapper)
    , [operation, resultMapper]),
    onSuccessCallback,
    onErrorCallback
  );


export default useFetch;
