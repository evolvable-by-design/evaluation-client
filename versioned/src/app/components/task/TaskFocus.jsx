import React from 'react'
import { useHistory } from 'react-router-dom'
import qs from 'qs'

import useQuery from '../../hooks/useQuery'
import TaskService from '../../services/TaskService'

import ConfirmOperationDialog from '../basis/ConfirmOperationDialog'
import TaskDialog from './TaskDialog'
import UpdateTaskDialog from './UpdateTaskDialog'

const TaskFocus = ({ tasks, onOperationInvokationSuccess }) => {
  const { taskFocus, actionFocus } = useQuery()
  const history = useHistory()

  if (tasks === undefined || taskFocus === undefined) {
    return null
  }

  const task = tasks.find(task => task.id === taskFocus)

  if (task === undefined) {
    hideTaskDialog(history)
    return null
  }

  const actions = taskActions(task, onOperationInvokationSuccess, history)
  const Action = actions[actionFocus]

  if (Action) {
    return <Action />
  } else if (task) {
    return <TaskDialog title={task.title} {...task}  actions={Object.keys(actions)} />
  } else {
    return null
  }
}

function taskActions(task, onOperationInvokationSuccess, history) {
  const commonProps = {
    onCloseComplete: () => hideTaskActionDialog(history),
    onSuccessCallback: () => {
      onOperationInvokationSuccess()
      hideTaskActionDialog(history)
    }
  }

  const actions = {
    Update: () => <UpdateTaskDialog task={task} isShown={true} {...commonProps} />,
    Delete: () => <ConfirmOperationDialog operation={() => TaskService.delete(task.id)} title='Delete' {...commonProps} intent='danger' />,
    "Move to QA": () => <ConfirmOperationDialog operation={() => TaskService.toQa(task.id)} title='Move to QA' {...commonProps} />,
    Complete: () => <ConfirmOperationDialog operation={() => TaskService.complete(task.id)} title='Complete' {...commonProps} />,
  }

  if (task.status !== 'QA') delete actions['Complete'];
  if (task.status === 'QA') delete actions['Move to QA'];

  return actions
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
