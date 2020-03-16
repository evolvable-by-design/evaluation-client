import React, { useCallback, useState } from 'react'
import { Dialog, Text, toaster } from 'evergreen-ui' 

import ProjectService from '../../services/ProjectService'

const DeleteProjectDialog = ({ projectId, onSuccessCallback, onCloseComplete }) => {
  const [ isLoading, setIsLoading ] = useState(false)
  const archive = useCallback(() => {
    setIsLoading(true)
    ProjectService.deleteOne(projectId)
      .then(() => {
        toaster.success('Successfully deleted project!')
        if (onSuccessCallback) { onSuccessCallback(); }
      })
      .catch(error => toaster.danger(`An error occured while trying to delete project: ${error.message}`))
      .finally(() => setIsLoading(false))
  }, [projectId, onSuccessCallback])

  return <Dialog
    isShown={true}
    title='Delete project'
    confirmLabel="Delete"
    intent="danger"
    isConfirmLoading={isLoading}
    onConfirm={archive}
    onCloseComplete={onCloseComplete}
    width="auto"
  >
    <Text>Are you sure that you want to delete this project?</Text>
  </Dialog>
}

export default DeleteProjectDialog