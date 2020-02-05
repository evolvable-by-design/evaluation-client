import React from 'react'
import { useHistory } from 'react-router-dom'
import { Pane, Paragraph, Pill, majorScale, minorScale } from 'evergreen-ui'
import qs from 'qs'

const TaskCard = ({id, title, points}) => {
  const history = useHistory()

  return <Pane 
    className="clickable"
    padding={majorScale(2)} 
    border="default" 
    borderRadius={minorScale(1)} 
    background="white"
    hoverElevation={1}
    onClick={() => showTaskDialog(id, history)}
  >
    <Pane display="flex" flexDirection="row" alignItems="baseline">
      <Paragraph flexGrow={2}><b>{title}</b></Paragraph>
      { points && <Pill display="inline-flex" margin={8}>{points}</Pill> }
    </Pane>
    <Paragraph>#{id.substring(0,6)}</Paragraph>
  </Pane>
}

function showTaskDialog(id, history) {
  const query = qs.parse(window.location.search.substring(1))
  query['taskFocus'] = id
  history.push(`${window.location.pathname}?${qs.stringify(query)}`)
}

export default TaskCard