import { useMemo } from 'react';

import { buildRequestWithDefaultParams, buildRequest } from '../utils/http'; 

export const useRequestBodySchema = (apiDocumentation, operation) => useMemo(
  () => operation && operation.requestBody
    ? apiDocumentation.requestBodySchema(operation)
    : undefined,
  [apiDocumentation, operation]
);

export const buildRequestSync = (apiDocumentation, operation, requestBodySchema, parameters, form) => {
  // TODO: function to rewrite
  if (!operation) {
    return undefined;
  } else if (operation.verb === 'get' && apiDocumentation.notContainsRequiredParametersWithoutDefaultValue(operation)) {
    return buildRequestWithDefaultParams(operation, requestBodySchema);
  } else if (parameters || form) {
    return buildRequest(operation, parameters, form);
  } else {
    return undefined;
  }
}

