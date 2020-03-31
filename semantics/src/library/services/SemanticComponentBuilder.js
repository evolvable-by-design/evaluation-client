import React from 'react'
import { Spinner } from 'evergreen-ui'

import SemanticData from './SemanticData'

import { useAsync } from '../../app/hooks'

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

      const [resultOfGetRequired] = useAsync(() => this._getRequired(props.value), [props.value])
      const [requiredData, missingData] = resultOfGetRequired || [ undefined, {} ]
      const [ optionalData ] = useAsync(() => this._getOptionals(props.value), [props.value])
      
      if (Object.keys(missingData).length !== 0) {
        return this.errorHandler({missingData})
      }

      if (!requiredData || !optionalData) {
        return <Spinner />
      } else {
        // TODO: support ignoredData + semanticData is temporary, it should disappear
        const Component = () => this.component({ ...props, ...requiredData, ...optionalData, semanticData: props.value })
        return <Component />
      }
    }
  }

  async _getRequired(semanticData) {
    const result = await this._getDataWithSemantics(this.requiredData, semanticData)
    const missingData = Object.entries(result).filter(([key, value]) => value === undefined).map(([key, value]) => key);
    return [result, missingData];
  }

  async _getOptionals(semanticData) {
    return await this._getDataWithSemantics(this.optionalData, semanticData)
  }

  async _getDataWithSemantics(keys, semanticData) {
    return Promise.all(
      Object.entries(keys)
        .map(([key, semanticKey]) => semanticData.get(semanticKey)
          .then(data => {
            if (data === undefined) { return [] }
        
            return [
              [ key, data instanceof Array ? data.map(el => el.value) : data.value ],
              [ `${key}Semantics`, data ]
            ]
          })
        )
      ).then(values => values
        .filter(el => el.length === 2)
        .reduce((acc, currentValue) => {
          currentValue.forEach(([key, value]) => { acc[key] = value })
          return acc
        }, {})
      )
  }

}

export default SemanticComponentBuilder

