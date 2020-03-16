import HttpClient from './HttpClient'

class ProjectService {

  async list(offset, limit, isPublic) {
    const response = await HttpClient().get(
      `/projects?offset=${offset || 0}&limit=${limit || 3}&public=${isPublic || false}`
    )
    return response.data.projects
  }

  async create(name, isPublic) {
    const response = await HttpClient().post(
      '/projects',
      { name, isPublic }
    )
    return response.data
  }

  async findOne(id) {
    const response = await HttpClient().get(`/project/${id}`)
    return response.data
  }

  async deleteOne(id) {
    const response = await HttpClient().delete(`/project/${id}`)
    return response.status === '204'
  }

  async addCollaborator(projectId, users) {
    const response = await HttpClient().post(`/project/${projectId}/addCollaborator`, { users })
    return response.status === '204'
  }

  async archive(projectId) {
    const response = await HttpClient().put(`/project/${projectId}/archive`)
    return response.status === '204'
  }

  async unarchive(projectId) {
    const response = await HttpClient().put(`/project/${projectId}/unarchive`)
    return response.status === '204'
  }

}

export default new ProjectService()