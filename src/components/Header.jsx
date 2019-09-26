import React from 'react'
import { Pane, Text, majorScale } from 'evergreen-ui'

function Header({ width }) {
  return (
    <Pane width={ width || majorScale(9) } background='#0747A6'>
      <Text color='white'>This is the header</Text>
    </Pane>
  );
}

export default Header