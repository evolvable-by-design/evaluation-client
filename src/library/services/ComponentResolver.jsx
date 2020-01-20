import React from 'react'
import { useLibraryContextState } from '../react/LibraryContext'

import UglyGenericComponent from '../react/UglyGenericComponent'

function ComponentResolver({ semanticData }) {
  const { components, GenericComponent } = useLibraryContextState()

  const MaybeComponent = components
      .find(semanticComponent => semanticComponent.canDisplay(semanticData.type, semanticData.resourceSchema.format))
      .build()
    
  if (MaybeComponent) {
    return <MaybeComponent value={semanticData} />
  } else if (GenericComponent) {
    return <GenericComponent semanticData={semanticData} />
  } else {
    return <UglyGenericComponent semanticData={semanticData} />
  }
}

export default ComponentResolver;