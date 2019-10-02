export function buildRequestWithDefaultParams(operation, requestBodySchema) {
  return {
    method: operation.verb,
    url: buildUrlWithDefaultParams(operation),
    data: buildBodyWithDefaultParams(operation.operationId, requestBodySchema),
    headers: buildHeadersWithDefaultParams(operation)
  };
}

function buildUrlWithDefaultParams(operation) {
  let url = operation.url;

  if (operation.parameters) {
    operation.parameters
      .filter(param => param.in === 'path' && param.schema.default !== undefined)
      .forEach(param => url.replace(param.name, param.schema.default));

    operation.parameters
      .filter(param => param.in === 'query' && param.schema.default !== undefined)
      .forEach((param, i) => {
        if (i === 0) {
          url += `?${param.name}=${param.schema.default}`
        } else {
          url += `&${param.name}=${param.schema.default}`
        }
      });
  }

  return url;
}

function buildBodyWithDefaultParams(operationId, requestBodySchema) {
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
      .filter(key => requestBodySchema.properties[key].default)
      .forEach(key => body[key] = requestBodySchema.properties[key].default)

    return body;
  }
}

function buildHeadersWithDefaultParams(operation) {
  if (operation.parameters) {
    const headers = {};
    operation.parameters
      .filter(param => param.in === 'header' && param.schema.default !== undefined)
      .forEach(param => headers[param.name] = param.schema.default);
    return headers;
  } else {
    return undefined;
  }
}

export function buildRequest(operation, parameters, form) {
  // TODO
  return {};
}