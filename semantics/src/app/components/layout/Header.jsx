import React from 'react'
import { Link } from 'react-router-dom'
import { Pane, Heading, majorScale } from 'evergreen-ui'

import UserProfileBubble from '../user/UserProfileBubble'

function Header({ width }) {
  return (
    <Pane width={ width || majorScale(9) } background='#0747A6' display="flex" flexDirection="column" justifyContent="space-between" paddingY={majorScale(2)} paddingX={majorScale(1)}>
      <Pane display="flex" flexDirection="column" justifyContent="flext-start">
        <Link to="/"><Heading size={600} color='white'><b>Gira</b></Heading></Link>
      </Pane>
      <Pane display="flex" flexDirection="column" justifyContent="flext-end">
        <UserProfileBubble />
      </Pane>
    </Pane>
  );
}

export default Header
