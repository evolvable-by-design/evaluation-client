import React from 'react'
import { Link, useHistory } from 'react-router-dom'
import { Avatar, IconButton, Menu, Popover, Position, Tooltip } from 'evergreen-ui'

import { useAppContextState } from '../../context/AppContext';
import AuthenticationService from '../../services/AuthenticationService';
import Semantics from '../../utils/semantics';

const UserProfileBubble = () => {
  const history = useHistory();
  const context = useAppContextState();
  const { userProfile } = context;

  if (AuthenticationService.isAuthenticated()) {
    return <Popover
      position={Position.RIGHT}
      content={
        <Menu>
          <Menu.Group>
            <Menu.Item
              onSelect={() => history.push('/logout')}
              intent="danger"
              icon="log-out"
            >
              Logout...
            </Menu.Item>
          </Menu.Group>
        </Menu>
      }
    >
      <Tooltip content="Your profile and settings">
        <Avatar name={ (userProfile && userProfile.getValue(Semantics.meb.terms.username)) || 'John Doe' }
          size={40} marginX="auto"/>
      </Tooltip>
    </Popover>  
  } else {
    return <Login />
  }
}

const Login = () => <Link to="/login"><IconButton icon="log-in" height={40} borderRadius='500px'/></Link>

export default UserProfileBubble;