import { useMemo } from 'react'; 

export const useFiltersToRender = (apiDocumentation, operation, setParameters) => useMemo(
  () => operation && operation.parameters
    ? generateFilters(apiDocumentation.resolveParameters(operation), setParameters)
    : undefined,
  [apiDocumentation, operation, setParameters]
);
  
const generateFilters = (parameters, setParameters) => undefined;

export const useFormToRender = (operation, requestBodySchema, setForm) => useMemo(
  () => operation && operation.requestBody
    ? generateForm(requestBodySchema, setForm)
    : undefined,
  [operation, requestBodySchema, setForm]
);

const generateForm = (bodySchema, setForm) => undefined;