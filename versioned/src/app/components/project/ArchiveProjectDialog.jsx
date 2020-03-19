import React from 'react'

import ConfirmOperationDialog from '../basis/ConfirmOperationDialog'

import ProjectService from '../../services/ProjectService'

const ArchiveProjectDialog = ({ projectId, isArchived, onSuccessCallback, onCloseComplete }) => {
  return <ConfirmOperationDialog 
    operation={() => ProjectService.archive(projectId)}
    title={ isArchived ? 'Unarchive project' : 'Archive project' }
    onSuccessCallback={onSuccessCallback}
    onCloseComplete={onCloseComplete}
  />
}

export default ArchiveProjectDialog