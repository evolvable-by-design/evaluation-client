import React from 'react';

import { useMemo } from 'react'; 

import GenericFilters from '../components/GenericFilters';
import GenericForm from '../components/GenericForm';

export const useFiltersToRender = (operation, values, setValues, errors, setErrors) => useMemo(
  () => operation && operation.parameters
    ? <GenericFilters parameters={operation.parameters} values={values} setValues={setValues} errors={errors} setErrors={setErrors} />
    : undefined,
  [operation, values, setValues, errors, setErrors]
);

export const useFormToRender = (operation, requestBodySchema, values, setValues, errors, setErrors) => useMemo(
  () => operation && operation.requestBody
    ? GenericForm({bodySchema: requestBodySchema, values, setValues, errors, setErrors})
    : undefined,
  [operation, requestBodySchema, values, setValues, errors, setErrors]
);
