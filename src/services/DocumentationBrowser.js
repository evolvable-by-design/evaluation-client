class DocumentationBrowser {

  constructor(documentation) {
    this.documentation = documentation;
  }

  findOperation(target) {
    const operationFromId = this._findOperationWithId(target);
    if (operationFromId) {
      return operationFromId;
    }

    const operationReturningTarget = this._findOperationThatReturns(target);
    return operationReturningTarget;
  }

  resolveParameters(operation) {
    // TODO
    return undefined;
  }

  findSchema(operationId) {
    // TODO
    return undefined;
  }

  notContainsRequiredParametersWithoutDefaultValue(operation) {
    // TODO
    // return undefined;
    return true;
  }

  _findOperationWithId(target) {
    // TODO
    return {
      method: 'get',
      url: '/projects',
      operationId: 'listProjects'
    };
  }

  _findOperationThatReturns(target) {
    // TODO
    return undefined;
  }

}

export default DocumentationBrowser;