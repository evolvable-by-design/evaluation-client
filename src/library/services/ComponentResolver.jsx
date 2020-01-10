import React from 'react'
import { useLibraryContextState } from '../react/LibraryContext'

import UglyGenericComponent from '../react/UglyGenericComponent'

function ComponentResolver({ semanticData }) {
  const { components, genericComponent } = useLibraryContextState()

  const maybeComponent = components
      .find(semanticComponent => semanticComponent.canDisplay(semanticData.type))
    
  if (maybeComponent) {
    return <maybeComponent value={semanticData} />
  } else if (genericComponent) {
    return <genericComponent semanticData={semanticData} />
  } else {
    return <UglyGenericComponent semanticData={semanticData} />
  }
}

export default ComponentResolver;