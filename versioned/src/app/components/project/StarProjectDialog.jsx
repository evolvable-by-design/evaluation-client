import React from 'react'

import ConfirmOperationDialog from '../basis/ConfirmOperationDialog'

import ProjectService from '../../services/ProjectService'

const StarProjectDialog = ({ projectId, isStarred, onSuccessCallback, onCloseComplete }) => {
  return <ConfirmOperationDialog 
    operation={() => ProjectService.star(projectId)}
    title={ isStarred ? 'Unstar' : 'Star' }
    onSuccessCallback={onSuccessCallback}
    onCloseComplete={onCloseComplete}
  />
}

export default StarProjectDialog