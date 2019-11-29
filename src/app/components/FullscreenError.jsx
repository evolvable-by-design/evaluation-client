import React from 'react';

import FullscreenCenterContainer from './FullscreenCenterContainer'
import Error from './Error'

const FullScreenError = ({error}) => {
  return <FullscreenCenterContainer>
    <Error error={error} />
  </FullscreenCenterContainer>
}

export default FullScreenError