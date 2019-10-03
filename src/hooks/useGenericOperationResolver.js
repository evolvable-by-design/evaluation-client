import { useState, useMemo } from 'react';

import { useApiContext } from '../components/App';
import { useFetchWithContext } from '../hooks/useFetch'; 
import { useFiltersToRender, useFormToRender } from './componentsGenerationHooks';
import { useRequestBodySchema, buildRequestSync } from '../hooks/documentationHooks';

function useGenericOperationResolver(target) {
  const apiDocumentation = useApiContext();

  const operation = useMemo(() => apiDocumentation.findOperation(target), [target, apiDocumentation]);
  return useGenericOperationResolverOperation(operation);
}

export function useGenericOperationResolverOperation(operation) {
  const apiDocumentation = useApiContext();
  const requestBodySchema = useRequestBodySchema(apiDocumentation, operation);

  const [ parameters, setParameters ] = useState(defaultParamValues(operation.parameters));
  const [ parameterErrors, setParamaterErrors ] = useState({});
  const filtersToDisplay = useFiltersToRender(operation, parameters, setParameters, parameterErrors, setParamaterErrors);

  const [ form, setForm ] = useState(defaultBodyValues(requestBodySchema));
  const [ formErrors, setFormErrors ] = useState({});
  const formToDisplay = useFormToRender(operation, requestBodySchema, form, setForm, formErrors, setFormErrors);

  const [request, setRequest] = useState(buildDefaultRequest(apiDocumentation, operation, requestBodySchema));

  const triggerCall = () => setRequest(buildRequestSync(apiDocumentation, operation, requestBodySchema, parameters, form));

  const [ semanticData, isLoading, error ] = useFetchWithContext(request, operation);

  return [ semanticData, isLoading, error, triggerCall, filtersToDisplay, formToDisplay ];
}

function buildDefaultRequest(apiDocumentation, operation, requestBodySchema) {
  // TODO: function to rewrite
  if (operation && operation.verb === 'get' && apiDocumentation.notContainsRequiredParametersWithoutDefaultValue(operation)) {
    return buildRequestSync(apiDocumentation, operation, requestBodySchema);
  } else {
    return undefined;
  }
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
