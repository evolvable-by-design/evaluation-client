export function extractProjectTechnicalId(projectId) {
  if (projectId === undefined) {
    return undefined
  } else if (projectId.startsWith('/project/')) {
    return projectId.slice('/project/'.length)
  } else {
    return projectId
  }
}