import React from 'react'

import ConfirmOperationDialog from './ConfirmOperationDialog'

import ProjectService from '../services/ProjectService'

const ArchiveProjectDialog = ({ projectId, onSuccessCallback, onCloseComplete }) => {
  return <ConfirmOperationDialog 
    operation={() => ProjectService.archive(projectId)}
    title='Archive project'
    onSuccessCallback={onSuccessCallback}
    onCloseComplete={onCloseComplete}
  />
}

export default ArchiveProjectDialog