import React from 'react'
import { useHistory } from 'react-router-dom'
import qs from 'qs'
import { Badge, Dialog, Heading, Pane, Paragraph, Pill, majorScale } from 'evergreen-ui'

import ActionsSelector from './ActionsSelector'
import ContainerWithLabel from '../input/ContainerWithLabel'
import TextWithLabel from '../input/TextWithLabel'
import UserId from '../user/UserId'

const TaskDialog = ({ id, assignee, title, description, points, status, lastUpdate, actions }) => {
  const history = useHistory()

  return <Dialog
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

        <ContainerWithLabel label='Assignee'>
          <UserId id={assignee} />
        </ContainerWithLabel>

        { points && <ContainerWithLabel label='Points'>
            <Pill display="inline-flex" color={points < 8 ? 'green' : points < 14 ? 'orange' : 'red'}>{points}</Pill>
          </ContainerWithLabel>}

        <TextWithLabel label='Status'>{status}</TextWithLabel>

        { lastUpdate && <TextWithLabel label='Last update on'>{lastUpdate}</TextWithLabel> } 
      </Pane>
    </Pane>
  </Dialog>
}

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