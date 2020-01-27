import SemanticData from './SemanticData';

export class SemanticComponentBuilder {

  constructor(forType, component, requiredData, optionalData, toIgnoreData, errorHandler) {
    this.forType = forType instanceof Array ? forType : [forType];
    this.component = component;
    this.requiredData = requiredData || {};
    this.optionalData = optionalData || {}; 
    this.toIgnoreData = toIgnoreData || {};
    this.errorHandler = errorHandler;
  }

  canDisplay(type, format) {
    return this.forType.find(el => {
      if (el === Object(el)) { // isObject
        return el.type === type && (format === undefined || el.format === format)
      } else {
        return el === type && format === undefined
      }
    })
  }

  // Returns a react component
  build() {
    return (props) => {
      if (!(props.value instanceof SemanticData)) {
        if (props.value !== undefined) {
          console.error('[ERROR] SemanticComponent.render({value}) must be passed an instance of SemanticData')
        }
        return null
      }

      props.value.resetReadCounter()
      const [requiredData, missingData] = this._getRequired(props.value)
      if (Object.keys(missingData).length !== 0) {
        return this.errorHandler({missingData})
      }

      const optionalData = this._getOptionals(props.value)

      // TODO: support ignoredData + semanticData is temporary, it should disappear
      return this.component({ ...props, ...requiredData, ...optionalData, semanticData: props.value })
    }
  }

  _getRequired(semanticData) {
    const result = this._getDataWithSemantics(this.requiredData, semanticData)
    const missingData = Object.entries(result).filter(([key, value]) => value === undefined).map(([key, value]) => key);
    return [result, missingData];
  }

  _getOptionals(semanticData) {
    return this._getDataWithSemantics(this.optionalData, semanticData)
  }

  _getDataWithSemantics(keys, semanticData) {
    return Object.entries(keys)
      .map(([key, semanticKey]) => {
        const data = semanticData.get(semanticKey)
        if (data === undefined) { return [] }
        
        return [
          [ key, data instanceof Array ? data.map(el => el.value) : data.value ],
          [ `${key}Semantics`, data ]
        ]
      })
      .filter(el => el.length === 2)
      .reduce((acc, currentValue) => {
        currentValue.forEach(([key, value]) => { acc[key] = value })
        return acc
      }, {})
  }

}

export default SemanticComponentBuilder

