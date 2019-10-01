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

  const [ parameters, setParameters ] = useState(undefined);
  const [ form, setForm ] = useState(undefined);

  const operation = useMemo(() => apiDocumentation.findOperation(target), [target, apiDocumentation]);

  const filtersToDisplay = useFiltersToRender(operation, setParameters);
  const requestBodySchema = useRequestBodySchema(apiDocumentation, operation);
  const formToDisplay = useFormToRender(operation, requestBodySchema, setForm);

  const request = useRequest(apiDocumentation, operation, requestBodySchema, parameters, form);

  const [ data, type, schema, isLoading, error ] = useFetchWithContext(request, operation);
  return [ data, type, schema, isLoading, error, filtersToDisplay, formToDisplay ];
}

export default useGenericOperationResolver;
