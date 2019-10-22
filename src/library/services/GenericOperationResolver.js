import GenericFilters from '../components/GenericFilters';
import GenericForm from '../components/GenericForm';
import { NotFoundOperation } from '../../app/utils/Errors';
import GenericOperationCaller from './GenericOperationCaller';

class GenericOperationResolver {

  static fromKey(actionKey, apiDocumentation) {
    const maybeOperation = apiDocumentation.findOperation(actionKey)

    if (maybeOperation === undefined) 
      throw new NotFoundOperation()
    
    return GenericOperationResolver.fromOperation(maybeOperation, apiDocumentation)
  }

  static fromOperation(operation, apiDocumentation) {
    return new GenericOperationResolver(operation, apiDocumentation)
  }

  constructor(operation, apiDocumentation) {
    if (operation === undefined || apiDocumentation === undefined) {
      throw new Error('GenericOperationResolver requires both operation and apiDocumentation')
    }

    this.operation = operation
    this.apiDocumentation = apiDocumentation
  }

  getCaller() {
    return new GenericOperationCaller(
      this.operation,
      this.apiDocumentation,
      this._getRequestBodySchema(),
      this.getDefaultBodyValue(),
      this.getDefaultParameters()
    )
  }

  hasForm = () => this.getForm() !== undefined

  getFormWithDefaultValues() {
    return [this.getForm(), this.getDefaultBodyValue()]
  }

  getForm() {
    if (this.form === undefined && this.operation.requestBody) {
      const bodySchema = this._getRequestBodySchema()
      this.form = ({values, setValues, errors, setErrors}) =>
        GenericForm({bodySchema, values, setValues, errors, setErrors})
    }

    return this.form
  }

  getDefaultBodyValue() {
    if (!this.hasForm()) return undefined

    return Object.entries(this._getRequestBodySchema().properties)
      .filter(([name, value]) => value.default !== undefined)
      .reduce((acc, [name, value]) => {
        acc[name] = value.default
        return acc
      }, {})
  }

  hasFilters = () => this.getFilters() !== undefined

  getFiltersWithDefaultValues() {
    return [this.getFilters(), this.getDefaultParameters()]
  }

  getFilters() {
    if (this.filters === undefined && this.operation.requestBody) {
      const parameters = this._getParameters()
      this.filters = ({values, setValues, errors, setErrors}) =>
        GenericFilters({parameters, values, setValues, errors, setErrors})
    }

    return this.filters
  }

  getDefaultParameters() {
    return (this._getParameters() || [])
      .filter(param => param.schema.default !== undefined)
      .reduce((acc, param) => { acc[param.name] = param.schema.default; return acc; }, {})
  }

  _getRequestBodySchema() {
    if (this.requestBodySchema === undefined && this.operation.requestBody) {
      this.requestBodySchema = this.apiDocumentation.requestBodySchema(this.operation)
    }
    return this.requestBodySchema
  }

  _getParameters() {
    return this.operation.parameters
  }

}

export default GenericOperationResolver
