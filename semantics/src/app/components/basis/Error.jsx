import React from 'react';

import { Heading, Paragraph, majorScale } from 'evergreen-ui';
import Semantics from '../../utils/semantics'

const ErrorComponent = ({error}) => {
  // console.error(error)

  const errorCode = error.getValue ? error.getValue(Semantics.schema.terms.identifier) : undefined

  return <>
    <Heading width="100%" size={700} marginBottom={majorScale(2)}>Sorry, something went wrong <span role='img' aria-label='disappointed'>😕</span></Heading>
    { errorCode && <Paragraph width="100%" size={500}>Received error:{errorCode}</Paragraph> }
  </>
}

export default ErrorComponent