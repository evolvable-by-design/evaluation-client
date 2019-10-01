import { useMemo } from 'react'; 

export const useFiltersToRender = (operation, setParameters) => useMemo(
  () => operation && operation.parameters
    ? generateFilters(operation.parameters, setParameters)
    : undefined,
  [operation, setParameters]
);
  
// TODO
const generateFilters = (parameters, setParameters) => undefined;

export const useFormToRender = (operation, requestBodySchema, setForm) => useMemo(
  () => operation && operation.requestBody
    ? generateForm(requestBodySchema, setForm)
    : undefined,
  [operation, requestBodySchema, setForm]
);

// TODO
const generateForm = (bodySchema, setForm) => undefined;