import React from 'react'
import { Pane, majorScale } from 'evergreen-ui'

const TaskCard = ({}) => <Pane 
  padding={majorScale(2)} 
  border="default" 
  borderRadius={majorScale(1)} 
  background="white"
  hoverElevation={1}
>
  Will become a task card in the near future
</Pane>

// TODO: add semantic version

export default TaskCard