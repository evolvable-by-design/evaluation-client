import React from 'react';

import SemanticData from "./SemanticData";

import { mapObject } from "../utils/javascript-utils";

export class SemanticComponentBuilder {

  constructor(forType, component, requiredData, optionalData, toIgnoreData, errorHandler) {
    this.forType = forType;
    this.component = component;
    this.requiredData = requiredData || {};
    this.optionalData = optionalData || {}; 
    this.toIgnoreData = toIgnoreData || {};
    this.errorHandler = errorHandler;
  }

  canDisplay(type) {
    return this.forType === type;
  }

  // Returns a react component
  build() {
    return ({value}) => {
      if (!value instanceof SemanticData) {
        console.error('[ERROR] SemanticComponent.render({value}) must be passed an instance of SemanticData');
        return <React.Fragment></React.Fragment>
      }

      const [requiredData, missingData] = this._getRequired(value);
      if (Object.keys(missingData).length !== 0) {
        return this.errorHandler({missingData});
      }

      // TODO: support optional and ignoredData
      return this.component({ ...requiredData});
    }
  }

  _getRequired(semanticData) {
    const result = mapObject(this.requiredData, (key, semanticKey) => {
      return [key, semanticData.getValue(semanticKey)]
    });
    const missingData = Object.entries(result).filter(([key, value]) => value === undefined).map(([key, value]) => key);
    return [result, missingData];
  }

}

