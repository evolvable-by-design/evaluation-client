import React from 'react';

import { Pane, Spinner } from 'evergreen-ui';

const FullscreenLoader = () => (
  <Pane display="flex" alignItems="center" justifyContent="center" height="100vh" width="100vw">
    <Spinner />
  </Pane>
) 

export default FullscreenLoader;