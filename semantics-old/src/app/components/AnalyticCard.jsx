import React from 'react'

import { Card, Icon, Heading, Pane, majorScale } from 'evergreen-ui'

import { capitalize } from '../utils/javascriptUtils'

const AnalyticCard = ({ icon, iconColor, label, value }) => 
  <Card width="260px" height="250px" display="flex" flexDirection="column" justifyContent="space-between" alignItems='center' elevation={1} padding={majorScale(4)} marginRight={majorScale(2)} marginBottom={majorScale(2)}>
    <Pane borderRadius='100px' width='32px' height='32px' backgroundColor={ iconColor.startsWith('#') ? `${iconColor}20` : `rgba(${iconColor}, 0.5)`} display='flex' justifyContent='center' alignItems='center'>
      <Icon icon={icon} size={18} color={iconColor} />
    </Pane>

    <Heading size={800} color='black' textAlign='center'>{value}</Heading>

    <Heading size={500} color='grey' textAlign='center'>{capitalize(label)}</Heading>
  </Card>

export default AnalyticCard