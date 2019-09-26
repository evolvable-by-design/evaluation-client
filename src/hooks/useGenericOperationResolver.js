import { useState, useMemo } from 'react';

import { buildRequestWithDefaultParams, buildRequest } from '../utils/http';
import { useApiContext } from '../components/App';
import useFetch from '../hooks/useFetch'; 

/*
function useGenericOperationResolver(target) =
  useGenericOperationResolver2(useMemo(() => apiDocumentation.findOperation(target), [target]))

where useGenericOperationResolver2 takes an operation as input
*/

function useGenericOperationResolver(target) {
  const apiDocumentation = useApiContext();

  const [ parameters, setParameters ] = useState(undefined);
  const [ form, setForm ] = useState(undefined);

  const operation = useMemo(() => apiDocumentation.findOperation(target), [target, apiDocumentation]);

  const filtersToDisplay = useMemo(
    () => operation && operation.parameters
      ? generateFilters(apiDocumentation.resolveParameters(operation), setParameters)
      : undefined,
    [apiDocumentation, operation]);

  const requestBodySchema = useMemo(
    () => operation && operation.requestBody
      ? apiDocumentation.findSchema(operation.operationId)
      : undefined,
    [apiDocumentation, operation]);

  const formToDisplay = useMemo(
    () => operation && operation.requestBody
      ? generateForm(requestBodySchema, setForm)
      : undefined,
    [operation, requestBodySchema]
  );

  const request = useMemo(
    () => !operation
      ? undefined
      : apiDocumentation.notContainsRequiredParametersWithoutDefaultValue(operation)
        ? buildRequestWithDefaultParams(operation, requestBodySchema)
        : buildRequest(operation, parameters, form),
    [apiDocumentation, operation, requestBodySchema, parameters, form]);

  console.log(request);

  const [ data, isLoading, error ] = useFetch(request);
  return [ data, isLoading, error, filtersToDisplay, formToDisplay ];
}

function generateFilters(parameters, setParameters) {
  return undefined;
}

function generateForm(bodySchema, setForm) {
  return undefined;
}

export default useGenericOperationResolver;
