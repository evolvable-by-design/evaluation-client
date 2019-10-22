import { useState, useCallback, useMemo } from 'react';
import { useHistory } from 'react-router-dom';

import { useAppContextState } from '../../app/context/AppContext'
import { useFetchWithContext } from './useFetch'; 
import { useFiltersToRender, useFormToRender } from './componentsGenerationHooks';
import { buildRequest, inputParamValueOrDefault, inputBodyValueOrDefault } from '../utils/requestBuilder';
import { AuthenticationRequiredError } from '../../app/utils/Errors';

function useGenericOperationResolver(actionKey, operation, onSuccessCallback, onErrorCallback) {
  const { apiDocumentation } = useAppContextState();
  const history = useHistory();

  const foundOperation = useMemo(() => {
    try {
      return operation || apiDocumentation.findOperation(actionKey)
    } catch (error) {
      if (error instanceof AuthenticationRequiredError) {
        console.log('Redirecting to login')
        history.push('/login')
      }
      return undefined
    }
  }, [actionKey, operation, apiDocumentation, history]);
  
  return useGenericOperationResolverOperation(foundOperation, onSuccessCallback, onErrorCallback);
}

export function useGenericOperationResolverOperation(operation, onSuccessCallback, onErrorCallback) {
  const { apiDocumentation } = useAppContextState();
  const requestBodySchema = useRequestBodySchema(apiDocumentation, operation);

  const defaultParametersState = useMemo(() => inputParamValueOrDefault(operation, {}), [operation]);
  const [ parameters, setParameters ] = useState(defaultParametersState);
  const [ parameterErrors, setParamaterErrors ] = useState({});
  const filtersToDisplay = useFiltersToRender(operation, parameters, setParameters, parameterErrors, setParamaterErrors);

  const defaultFormState = useMemo(() => inputBodyValueOrDefault(requestBodySchema, {}), [requestBodySchema]);
  const [ form, setForm ] = useState(defaultFormState);
  const [ formErrors, setFormErrors ] = useState({});
  const formToDisplay = useFormToRender(operation, requestBodySchema, form, setForm, formErrors, setFormErrors);

  const defaultRequest = useMemo(
    () => buildDefaultRequest(apiDocumentation, operation),
    [apiDocumentation, operation]
  );
  const [request, setRequest] = useState(defaultRequest);

  const [shouldRecomputeRequest, setShouldRecomputeRequest] = useState(true);

  const triggerCall = useCallback(() => setShouldRecomputeRequest(true), [])

  const [ missingRequiredParams, setMissingRequiredParams ] = useState()

  useEffect(() => {
    // compute missingRequiredParams...
  }, [form, parameters] )

  if (shouldRecomputeRequest) {
    setShouldRecomputeRequest(false);
    const request = buildRequest(apiDocumentation, operation, parameters, form);
    setRequest(request)
  }

  const [ semanticData, isLoading, error ] = useFetchWithContext(request, operation, undefined, onSuccessCallback, onErrorCallback);

  return operation === undefined
    ? [ undefined, undefined, 'Operation not found', undefined, undefined, undefined, undefined ]
    : [ semanticData, isLoading, error, triggerCall, filtersToDisplay, formToDisplay, operation ];
}

function buildDefaultRequest(apiDocumentation, operation) {
  return operation && operation.verb === 'get'
    ? buildRequest(apiDocumentation, operation, {}, {})
    : undefined;
}

const useRequestBodySchema = (apiDocumentation, operation) => useMemo(
  () => operation && operation.requestBody
    ? apiDocumentation.requestBodySchema(operation)
    : undefined,
  [apiDocumentation, operation]
);

export default useGenericOperationResolver;
