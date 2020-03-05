import HttpClient from '../services/HttpClient'
import { TaskTypes } from '../domain/Task'

class TaskService {

  static async list(projectId, offset, limit, createdAfter) {
    const params = []
    if (offset) params.push(`offset=${offset}`)
    if (limit) params.push(`limit=${limit}`)
    if (createdAfter) params.push(`createdAfter=${createdAfter}`)

    const url = params.reduce((url, param, i) =>
      url + (i === 0 ? '?' : '&') + param,
      `/project/${projectId}/tasks`
    )

    const response = await HttpClient().get(url)
    return response.data.tasks
  }

  static async create(projectId, type, task) {
    if (type === TaskTypes.TechnicalStory) {
      return HttpClient().post(`/project/${projectId}/tasks/technicalStory`, task)
    } else if (type === TaskTypes.UserStory) {
      return HttpClient().post(`/project/${projectId}/tasks/userStory`, task)
    } else {
      return new Promise((_, rej) => rej(new Error('Incorrect task type provided')))
    }
  }

  static async findOne(projectId, taskId) {
    return HttpClient().get(`/project/${projectId}/task/${taskId}`)
  }

  static async update(projectId, task) {
    return HttpClient().put(`/project/${projectId}/task/${task.id}`, task)
  }

  static async toQa(projectId, taskId) {
    return HttpClient().put(`/project/${projectId}/task/${taskId}/toQa`)
  }

  static async complete(projectId, taskId) {
    return HttpClient().put(`/project/${projectId}/task/${taskId}/complete`)
  }

  static async delete(projectId, taskId) {
    return HttpClient().delete(`/project/${projectId}/task/${taskId}`)
  }

}

export default TaskService