import { useMemo } from 'react'; 

import GenericFilters from '../components/GenericFilters';
import GenericForm from '../components/GenericForm';

export const useFiltersToRender = (operation, values, setValues) => useMemo(
  () => operation && operation.parameters
    ? GenericFilters({parameters: operation.parameters, values, setValues})
    : undefined,
  [operation, values, setValues]
);

export const useFormToRender = (operation, requestBodySchema, values, setValues) => useMemo(
  () => operation && operation.requestBody
    ? GenericForm({bodySchema: requestBodySchema, values, setValues})
    : undefined,
  [operation, requestBodySchema, values, setValues]
);
