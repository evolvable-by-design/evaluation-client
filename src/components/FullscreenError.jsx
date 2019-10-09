import React from 'react';

import { Heading, Pane, Paragraph, majorScale } from 'evergreen-ui';

const FullScreenError = ({error}) =>
  <Pane width="100vw" height="100vh" display="flex" flexDirection="column" justifyContent="center" paddingX="25%">
    <Heading width="100%" size={700} marginBottom={majorScale(2)}>Sorry, something went wrong 😕</Heading>
    <Paragraph width="100%" size={500}>{error}</Paragraph>
  </Pane>

export default FullScreenError