import React from 'react';

import FullscreenCenterContainer from '../layout/FullscreenCenterContainer'
import ErrorComponent from './Error'

const FullScreenError = ({error}) => {
  return <FullscreenCenterContainer>
    <ErrorComponent error={error instanceof Error ? error.message : error} />
  </FullscreenCenterContainer>
}

export default FullScreenError