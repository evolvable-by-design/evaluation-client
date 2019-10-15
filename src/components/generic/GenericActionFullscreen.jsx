import React from 'react';

import GenericAction from './GenericAction';
import FullscreenCenterContainer from '../FullscreenCenterContainer';

const GenericActionFullscreen = ({ Loading, Success, ErrorComponent, Component, actionKey, operation, onSuccessCallback, onErrorCallback }) =>
  <FullscreenCenterContainer>
    <GenericAction
      actionKey={actionKey}
      operation={operation}
      Loading={Loading}
      Success={Success}
      ErrorComponent={ErrorComponent}
      Component={Component}
      onSuccessCallback={onSuccessCallback}
      onErrorCallback={onErrorCallback}
    />
  </FullscreenCenterContainer>

export default GenericActionFullscreen;
