import React from 'react'
import { Pane, Text, majorScale } from 'evergreen-ui'

import UserProfileBubble from './UserProfileBubble'

function Header({ width }) {
  return (
    <Pane width={ width || majorScale(9) } background='#0747A6' display="flex" flexDirection="column" justifyContent="space-between" paddingY={majorScale(2)} paddingX={majorScale(1)}>
      <Pane display="flex" flexDirection="column" justifyContent="flext-start">
        <Text color='white'>This is the header</Text>
      </Pane>
      <Pane display="flex" flexDirection="column" justifyContent="flext-end">
        <UserProfileBubble />
      </Pane>
      
    </Pane>
  );
}

export default Header
