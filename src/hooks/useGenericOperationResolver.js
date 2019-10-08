import { useState, useCallback, useMemo } from 'react';

import { useApiContext } from '../components/App';
import { useFetchWithContext } from '../hooks/useFetch'; 
import { useFiltersToRender, useFormToRender } from './componentsGenerationHooks';
import { useRequestBodySchema } from '../hooks/documentationHooks';
import { buildRequest, inputParamValueOrDefault, inputBodyValueOrDefault } from '../utils/requestBuilder';

function useGenericOperationResolver(target) {
  const apiDocumentation = useApiContext();

  const operation = useMemo(() => apiDocumentation.findOperation(target), [target, apiDocumentation]);
  return useGenericOperationResolverOperation(operation);
}

export function useGenericOperationResolverOperation(operation) {
  const apiDocumentation = useApiContext();
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
    () => buildDefaultRequest(apiDocumentation, operation, requestBodySchema),
    [apiDocumentation, operation, requestBodySchema]
  );
  const [request, setRequest] = useState(defaultRequest);

  const [shouldRecomputeRequest, setShouldRecomputeRequest] = useState(true);

  const triggerCall = useCallback(() => setShouldRecomputeRequest(true), [setShouldRecomputeRequest])

  if (shouldRecomputeRequest) {
    setShouldRecomputeRequest(false);
    const request = buildRequest(apiDocumentation, operation, requestBodySchema, parameters, form);
    setRequest(request)
  }

  const [ semanticData, isLoading, error ] = useFetchWithContext(request, operation);

  return [ semanticData, isLoading, error, triggerCall, filtersToDisplay, formToDisplay ];
}

function buildDefaultRequest(apiDocumentation, operation, requestBodySchema) {
  return operation && operation.verb === 'get'
    ? buildRequest(apiDocumentation, operation, requestBodySchema, {}, {})
    : undefined;
}

export default useGenericOperationResolver;
