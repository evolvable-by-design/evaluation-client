import React from 'react'

import { Card, Icon, Heading, Pane, majorScale } from 'evergreen-ui'

import { capitalize } from '../utils/javascriptUtils'

const PercentageAnalytic = ({ icon, iconColor, label, value, valueToDisplay }) => 
  <Card width="260px" height="250px" display="flex" flexDirection="column" alignItems='center' justifyContent='space-between' elevation={1} padding={majorScale(4)} marginRight={majorScale(2)} marginBottom={majorScale(2)} >
    <Pane borderRadius='100px' width='32px' height='32px' backgroundColor={ iconColor.startsWith('#') ? `${iconColor}20` : `rgba(${iconColor}, 0.5)`} display='flex' justifyContent='center' alignItems='center'>
      <Icon icon={icon} size={18} color={iconColor} />
    </Pane>

    <Pane>
      <Heading size={600} color={ value < 30 ? 'green' : value < 70 ? 'orange' : 'red' } textAlign='center'><b>{valueToDisplay || value}</b></Heading>
      <Pane display="flex" alignItems="end" height="70px" width='50px' backgroundColor='#eee'>
        <Pane height={`${value}%`} width='100%' backgroundColor='darkGrey'/>
      </Pane>
    </Pane>

    <Heading size={500} color='grey' textAlign='center'>{capitalize(label)}</Heading>
  </Card>

export default PercentageAnalytic