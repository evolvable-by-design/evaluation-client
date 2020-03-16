import React from 'react'
import { useHistory } from 'react-router-dom'
import qs from 'qs'

import ActionDialog from '../generic/ActionDialog'

import useQuery from '../../hooks/useQuery'
import Semantics from '../../utils/semantics'
import { TaskDialogSemantic as TaskDialog } from './TaskDialog'

const TaskFocus = ({ tasks, onOperationInvokationSuccess }) => {
  const { taskFocus, actionFocus } = useQuery()
  const history = useHistory()

  if (tasks === undefined || taskFocus === undefined) {
    return null
  }

  const task = tasks.find(task => task.getValue(Semantics.vnd_jeera.terms.taskId) === taskFocus)

  if (task === undefined) {
    hideTaskDialog(history)
    return null
  }

  const actions = taskActions(task)
  const action = (actions || []).find(action => action.key === actionFocus)

  if (action) {
    return <ActionDialog
      title={action.key}
      operationSchema={action.operation}
      onSuccessCallback={() => { onOperationInvokationSuccess(); hideTaskActionDialog(history) }}
      onCloseComplete={() => hideTaskActionDialog(history)}
    />
  } else if (task) {
    return <TaskDialog value={task} actions={actions.map(action => action.key)} />
  } else {
    return null
  }
}

function taskActions(task) {
  const actions = [
    Semantics.vnd_jeera.relations.delete,
    Semantics.vnd_jeera.relations.completeTask,
    Semantics.vnd_jeera.relations.toQATask,
    Semantics.vnd_jeera.relations.update,
  ]
  
  return task.getRelations(actions)
}

function hideTaskActionDialog(history) {
  const query = qs.parse(window.location.search.substring(1))
  delete query.actionFocus
  history.push(`${window.location.pathname}?${qs.stringify(query)}`)
}

function hideTaskDialog(history) {
  const query = qs.parse(window.location.search.substring(1))
  delete query.taskFocus
  history.push(`${window.location.pathname}?${qs.stringify(query)}`)
}

export default TaskFocus
