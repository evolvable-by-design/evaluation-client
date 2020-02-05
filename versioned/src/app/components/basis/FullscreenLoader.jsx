import React from 'react';

import { Spinner } from 'evergreen-ui';

import FullscreenCenterContainer from '../layout/FullscreenCenterContainer';

const FullscreenLoader = () => (
  <FullscreenCenterContainer>
    <Spinner />
  </FullscreenCenterContainer>) 

export default FullscreenLoader;
