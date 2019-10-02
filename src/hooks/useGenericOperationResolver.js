import { useState, useMemo } from 'react';

import { useApiContext } from '../components/App';
import { useFetchWithContext } from '../hooks/useFetch'; 
import { useFiltersToRender, useFormToRender } from './componentsGenerationHooks';
import { useRequestBodySchema, useRequest } from '../hooks/documentationHooks';

/*
function useGenericOperationResolver(target) =
  useGenericOperationResolver2(useMemo(() => apiDocumentation.findOperation(target), [target]))

where useGenericOperationResolver2 takes an operation as input
*/

function useGenericOperationResolver(target) {
  const apiDocumentation = useApiContext();

  const operation = useMemo(() => apiDocumentation.findOperation(target), [target, apiDocumentation]);
  const requestBodySchema = useRequestBodySchema(apiDocumentation, operation);

  const [ parameters, setParameters ] = useState(defaultParamValues(operation.parameters));
  const [ form, setForm ] = useState(defaultBodyValues(requestBodySchema));

  const filtersToDisplay = useFiltersToRender(operation, parameters, setParameters);
  const formToDisplay = useFormToRender(operation, requestBodySchema, form, setForm);

  const request = useRequest(apiDocumentation, operation, requestBodySchema, parameters, form);
  
  const [ data, isLoading, error ] = useFetchWithContext(request, operation);
  return [ data, isLoading, error, filtersToDisplay, formToDisplay ];
}

function defaultParamValues(parameters) {
  const result = {};

  if (parameters === undefined) return {};

  parameters.filter(p => p.schema.default !== undefined)
    .forEach(param => result[param.name] = param.schema.default);
  
  return result;
}

function defaultBodyValues(requestBodySchema) {
  // TODO: test this function
  if (requestBodySchema && requestBodySchema.properties) {
    return Object.entries(requestBodySchema.properties)
      .filter(([key, value]) => value.default !== undefined)
      .reduce((res, [key, value]) => { res[key] = value.default; return res; }, {});
  } else {
    return {};
  }
}

export default useGenericOperationResolver;
