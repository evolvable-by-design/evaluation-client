import { useMemo } from 'react';

export const useRequestBodySchema = (apiDocumentation, operation) => useMemo(
  () => operation && operation.requestBody
    ? apiDocumentation.requestBodySchema(operation)
    : undefined,
  [apiDocumentation, operation]
);

