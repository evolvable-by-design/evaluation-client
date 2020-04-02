import HttpClient from './HttpClient'
import { extractProjectTechnicalId } from '../utils/ResourceUtils'
import { extractLinkHeaderValues } from '../utils/HttpUtils'

class ProjectService {

  async list({offset, limit, url}) {
    const response = await HttpClient().get(
      url ? url : `/projects?offset=${offset || 0}&limit=${limit || 10}`
    )

    const linkHeaderValues = extractLinkHeaderValues(response.headers['link'])
    const nextPage = linkHeaderValues.find(entry => entry?.rel === 'http://www.w3.org/ns/hydra/core#next')?.value
    const lastPage = linkHeaderValues.find(entry => entry?.rel === 'http://www.w3.org/ns/hydra/core#last')?.value
    return { projects: response.data.projects, nextPage, lastPage }
  }

  async create(name) {
    const response = await HttpClient().post(
      '/projects',
      { name }
    )
    return response.data
  }

  async findOne(id) {
    const tecnicalId = extractProjectTechnicalId(id)
    const response = await HttpClient().get(`/project/${tecnicalId}`)
    return response.data
  }

  async deleteOne(id) {
    const tecnicalId = extractProjectTechnicalId(id)
    const response = await HttpClient().delete(`/project/${tecnicalId}`)
    return response.status === '204'
  }

  async addCollaborator(projectId, users) {
    const tecnicalId = extractProjectTechnicalId(projectId)
    const response = await HttpClient().post(`/project/${tecnicalId}/addCollaborator`, { users })
    return response.status === '204'
  }

  async archive(projectId) {
    const tecnicalId = extractProjectTechnicalId(projectId)
    const response = await HttpClient().post(`/project/${tecnicalId}/archive`)
    return response.status === '204'
  }

  async star(projectId) {
    const tecnicalId = extractProjectTechnicalId(projectId)
    const response = await HttpClient().post(`/project/${tecnicalId}/star`)
    return response.status === '204'
  }

}

export default new ProjectService()