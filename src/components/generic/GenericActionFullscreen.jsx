import React from 'react';

import GenericAction from './GenericAction';
import FullscreenCenterContainer from '../FullscreenCenterContainer';

const GenericActionFullscreen = ({ Loading, Success, ErrorComponent, Component, action, onSuccessCallback, onErrorCallback }) =>
  <FullscreenCenterContainer>
    <GenericAction
      action={action}
      Loading={Loading}
      Success={Success}
      ErrorComponent={ErrorComponent}
      Component={Component}
      onSuccessCallback={onSuccessCallback}
      onErrorCallback={onErrorCallback}
    />
  </FullscreenCenterContainer>

export default GenericActionFullscreen;
