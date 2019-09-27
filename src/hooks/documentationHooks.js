import { useMemo } from 'react';

import { buildRequestWithDefaultParams, buildRequest } from '../utils/http'; 

export const useRequestBodySchema = (apiDocumentation, operation) => useMemo(
  () => operation && operation.requestBody
    ? apiDocumentation.findSchema(operation.operationId)
    : undefined,
  [apiDocumentation, operation]
);

export const useRequest = (apiDocumentation, operation, requestBodySchema, parameters, form) => useMemo(() => {
  if (!operation) {
    return undefined;
  } else if (apiDocumentation.notContainsRequiredParametersWithoutDefaultValue(operation)) {
    return buildRequestWithDefaultParams(operation, requestBodySchema);
  } else {
    buildRequest(operation, parameters, form);
  }
}, [apiDocumentation, operation, requestBodySchema, parameters, form]);
