import React, { useCallback, useState } from 'react'
import { Dialog, Text, toaster } from 'evergreen-ui' 

import ProjectService from '../../services/ProjectService'

const UnarchiveProjectDialog = ({ projectId, onSuccessCallback, onCloseComplete }) => {
  const [ isLoading, setIsLoading ] = useState(false)
  const archive = useCallback(() => {
    setIsLoading(true)
    ProjectService.unarchive(projectId)
      .then(() => {
        toaster.success('Successfully unarchived project!');
        if (onSuccessCallback) { onSuccessCallback(); }
      })
      .catch(error => toaster.danger(`An error occured while trying to unarchive project: ${error.message}`))
      .finally(() => setIsLoading(false))
  }, [projectId])

  return <Dialog
    isShown={true}
    isConfirmLoading={isLoading}
    title='Unarchive project'
    confirmLabel="Confirm"
    onConfirm={archive}
    onCloseComplete={onCloseComplete}
    width="auto"
  >
    <Text>Are you sure that you want to unarchive this project?</Text>
  </Dialog>
}

export default UnarchiveProjectDialog