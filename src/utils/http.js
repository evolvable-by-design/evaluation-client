export function buildRequestWithDefaultParams(operation, requestBodySchema) {
  return {
    method: operation.verb,
    url: buildUrlWithDefaultParams(operation),
    data: buildBodyWithDefaultParams(operation.operationId, requestBodySchema),
    headers: buildHeadersWithDefaultParams(operation)
  };
}

const buildUrlWithDefaultParams = (operation) => buildUrl(operation, {})

function buildUrl(operation, parameters) {
  let url = operation.url;

  if (operation.parameters) {
    operation.parameters
      .filter(param =>
        param.in === 'path'
        && (param.schema.default !== undefined || parameters[param.name] !== undefined)
      )
      .forEach(param => url.replace(param.name, parameters[param.name] || param.schema.default));

      operation.parameters
      .filter(param =>
        param.in === 'query'
        && (param.schema.default !== undefined || parameters[param.name] !== undefined)
      )
      .forEach((param, i) => {
        url += (i === 0 ? '?' : '&') + `${param.name}=${parameters[param.name] || param.schema.default}`;
      });
  }

  return url;
}

const buildBodyWithDefaultParams = (operationId, requestBodySchema) =>
  buildBody(operationId, requestBodySchema, {})

function buildBody(operationId, requestBodySchema, values) {
  if (!requestBodySchema) {
    return undefined;
  } else if (!['object', 'array'].includes(requestBodySchema.type)) {
    console.error('Impossible de build a valid json document for operation with id: ' + operationId);
    return undefined;
  }

  if (requestBodySchema.type === 'array') {
    return requestBodySchema.default;
  } else {
    const body = {};
    Object.keys(requestBodySchema.properties)
      .filter(key => values[key] !== undefined || requestBodySchema.properties[key].default !== undefined)
      .forEach(key => body[key] = values[key] || requestBodySchema.properties[key].default)

    return body;
  }
}

const buildHeadersWithDefaultParams = (operation) => buildHeaders(operation, {})

function buildHeaders(operation, values) {
  if (operation.parameters) {
    const headers = {};
    operation.parameters
      .filter(param => param.in === 'header' && (values[param.name] !== undefined || param.schema.default !== undefined))
      .forEach(param => headers[param.name] = values[param.name] || param.schema.default);
    return headers;
  } else {
    return undefined;
  }
}

export function buildRequest(operation, parameters, form) {
  if (operation.requestBody && !operation.requestBody.content['application/json']) {
    return {};
  }

  const requestBodySchema = operation.requestBody.content['application/json'].schema;

  return {
    method: operation.verb,
    url: buildUrl(operation, parameters),
    data: buildBody(operation.operationId, requestBodySchema, form),
    headers: buildHeaders(operation, parameters)
  };
}