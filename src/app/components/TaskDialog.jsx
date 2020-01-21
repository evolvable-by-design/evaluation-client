import React from 'react'
import { useHistory } from 'react-router-dom'
import qs from 'qs'
import { Badge, Dialog, Heading, Pane, Paragraph, Pill, majorScale } from 'evergreen-ui'

import ComponentResolver from '../../library/services/ComponentResolver'
import SemanticComponentBuilder from '../../library/services/SemanticComponentBuilder'

import ActionsSelector from '../components/ActionsSelector'
import ContainerWithLabel from '../components/ContainerWithLabel'
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

          { points && <ContainerWithLabel label='Points'>
              <Pill display="inline-flex" color={points < 8 ? 'green' : points < 14 ? 'orange' : 'red'}>{points}</Pill>
            </ContainerWithLabel>}

          <TextWithLabel label='Status'>{status}</TextWithLabel>

          { lastUpdate && <TextWithLabel label='Last update on'>{lastUpdate}</TextWithLabel> } 
          {
            Object.entries(otherData).map(([key, value]) => 
              <ContainerWithLabel label={formatString(key)} key={key}>
                <ComponentResolver semanticData={value} />
              </ContainerWithLabel>
            )
          }
        </Pane>
      </Pane>
    </Dialog>
  </>
}

//{ ['boolean', 'number', 'string', 'bigint'].includes(typeof value) ? value : JSON.stringify(value) }

export const TaskDialogSemanticBuilder = new SemanticComponentBuilder(
  [ Semantics.vnd_jeera.terms.Task, Semantics.vnd_jeera.terms.TechnicalStory, Semantics.vnd_jeera.terms.UserStory ],
  TaskDialog,
  {
    id: Semantics.vnd_jeera.terms.taskId,
    title: Semantics.schema.terms.name,
    assignee: Semantics.vnd_jeera.terms.assignee,
    status: Semantics.vnd_jeera.terms.TaskStatus
  },
  {
    description: Semantics.schema.terms.description,
    points: Semantics.vnd_jeera.terms.points,
    lastUpdate: Semantics.schema.terms.lastUpdate
  },
  undefined,
  defaultSemanticComponentErrorHandler('task')
)

export const TaskDialogSemantic = TaskDialogSemanticBuilder.build()

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