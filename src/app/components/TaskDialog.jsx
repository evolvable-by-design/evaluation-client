import React from 'react'
import { useHistory } from 'react-router-dom'
import qs from 'qs'
import { Badge, Dialog, Heading, Pane, Paragraph, majorScale } from 'evergreen-ui'

import SemanticComponentBuilder from '../../library/services/SemanticComponentBuilder'

import ActionsSelector from '../components/ActionsSelector'
import TextWithLabel from '../components/TextWithLabel'
import { defaultSemanticComponentErrorHandler } from '../utils/Errors'
import Semantics from '../utils/semantics'
import { formatString } from '../utils/javascriptUtils'

const TaskDialog = ({ id, assignee, title, description, points, status, lastUpdate, semanticData }) => {
  const history = useHistory()
  const otherData = semanticData.getOtherData()
  const actions = semanticData.getOtherRelations()

  return <>
    <Dialog
      isShown={true}
      title={title}
      onCloseComplete={() => hideTaskDialog(history)}
      width={Math.min(document.body.clientWidth*0.7, 1200)}
      maxHeight={document.body.clientHeight*0.8}
      hasFooter={false}
    >
      <Pane display="flex" flexDirection="row">
        <Pane flexGrow={10} display="flex" flexDirection="column" marginRight={majorScale(2)}>
          <Paragraph marginBottom={majorScale(1)}><Badge>{id}</Badge></Paragraph>
          <Heading size={500} marginBottom={majorScale(2)}>Description</Heading>
          <Paragraph>{description || 'Empty description'}</Paragraph>
        </Pane>
        <Pane flexGrow={1} minWidth="200px" display="flex" flexDirection="column">
          <Pane><ActionsSelector actions={actions} onSelect={value => showTaskActionDialog(value, history)} /></Pane>
          <TextWithLabel label='Assignee'>{assignee}</TextWithLabel>
          { points && <TextWithLabel label='Points'>{points}</TextWithLabel> }
          <TextWithLabel label='Status'>{status}</TextWithLabel>
          <TextWithLabel label='Last update on'>{lastUpdate}</TextWithLabel>
          {
            Object.entries(otherData).map(([key, value]) => 
              <TextWithLabel label={formatString(key)} key={key}>
                { ['boolean', 'number', 'string', 'bigint'].includes(typeof value) ? value : JSON.stringify(value) }
              </TextWithLabel>
            )
          }
        </Pane>
      </Pane>
    </Dialog>
  </>
}

export const TaskDialogSemantic = new SemanticComponentBuilder(
  [ Semantics.schema.terms.Task, Semantics.schema.terms.TechnicalStory, Semantics.schema.terms.UserStory ],
  TaskDialog,
  {
    id: Semantics.vnd_jeera.terms.taskId,
    title: Semantics.schema.terms.name,
    assignee: Semantics.vnd_jeera.terms.assignee,
    status: Semantics.vnd_jeera.terms.TaskStatus,
    lastUpdate: Semantics.schema.terms.lastUpdate
  },
  {
    description: Semantics.schema.terms.description,
    points: Semantics.vnd_jeera.terms.points
  },
  undefined,
  defaultSemanticComponentErrorHandler('task')
).build()

function hideTaskDialog(history) {
  const query = qs.parse(window.location.search.substring(1))
  delete query.taskFocus
  history.push(`${window.location.pathname}?${qs.stringify(query)}`)
}

function showTaskActionDialog(key, history) {
  const query = qs.parse(window.location.search.substring(1))
  query['actionFocus'] = key
  history.push(`${window.location.pathname}?${qs.stringify(query)}`)
}

export default TaskDialog