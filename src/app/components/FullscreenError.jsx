import React from 'react';

import { Heading, Paragraph, majorScale } from 'evergreen-ui';

import FullscreenCenterContainer from './FullscreenCenterContainer';

const FullScreenError = ({error}) => {
  // console.error(error)
  return <FullscreenCenterContainer>
    <Heading width="100%" size={700} marginBottom={majorScale(2)}>Sorry, something went wrong <span role='img' aria-label='disappointed'>😕</span></Heading>
    <Paragraph width="100%" size={500}>{error}</Paragraph>
  </FullscreenCenterContainer>
}

export default FullScreenError