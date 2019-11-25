import React from 'react'
import { useHistory } from 'react-router-dom'
import { Pane, Paragraph, Pill, majorScale, minorScale } from 'evergreen-ui'
import qs from 'qs'

import SemanticComponentBuilder from '../../library/services/SemanticComponentBuilder'

import Semantics from '../utils/semantics'
import { defaultSemanticComponentErrorHandler } from '../utils/Errors'

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

export const TaskCardSemantic = new SemanticComponentBuilder(
  [ Semantics.schema.terms.Task, Semantics.schema.terms.TechnicalStory, Semantics.schema.terms.UserStory ],
  TaskCard,
  {
    id: Semantics.vnd_jeera.terms.taskId,
    title: Semantics.schema.terms.name
  },
  {
    points: Semantics.vnd_jeera.terms.points
  },
  undefined,
  defaultSemanticComponentErrorHandler('task')
).build()

function showTaskDialog(id, history) {
  const query = qs.parse(window.location.search.substring(1))
  query['taskFocus'] = id
  history.push(`${window.location.pathname}?${qs.stringify(query)}`)
}

export default TaskCard