import React from 'react'
import { useHistory } from 'react-router-dom'
import qs from 'qs'

import ActionDialog from './ActionDialog'

import useQuery from '../hooks/useQuery'
import Semantics from '../utils/semantics'
import { useAppContextState } from '../context/AppContext'
import { TaskDialogSemantic as TaskDialog } from './TaskDialog'

const TaskFocus = ({ tasks, onOperationInvokationSuccess }) => {
  const { genericOperationBuilder } = useAppContextState()
  const { taskFocus, actionFocus } = useQuery()
  const history = useHistory()

  if (tasks === undefined || taskFocus === undefined) {
    return null
  }

  const task = tasks.find(task => task.getValue(Semantics.vnd_jeera.terms.taskId) === taskFocus)
  const actions = taskFocus && task ? task.getOtherRelations() : undefined
  const action = (actions || []).find(([key, value]) => key === actionFocus)

  if (action) {
    return <ActionDialog
      genericOperationBuilder={genericOperationBuilder}
      title={action[0]}
      operationSchema={action[1]}
      onSuccessCallback={() => { onOperationInvokationSuccess(); hideTaskActionDialog(history); }}
      onCloseComplete={() => hideTaskActionDialog(history)}
    />
  } else if (task) {
    return <TaskDialog value={task} />
  } else {
    return null
  }
}

function hideTaskActionDialog(history) {
  const query = qs.parse(window.location.search.substring(1))
  delete query.actionFocus
  history.push(`${window.location.pathname}?${qs.stringify(query)}`)
}

export default TaskFocus
