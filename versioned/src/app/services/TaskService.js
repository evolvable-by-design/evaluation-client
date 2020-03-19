import HttpClient from './HttpClient'
import { TaskTypes } from '../domain/Task'

class TaskService {

  static async list(projectId, offset, limit, createdBefore) {
    const params = []
    params.push(`queryProjectId=${projectId}`)
    if (offset) params.push(`offset=${offset}`)
    if (limit) params.push(`limit=${limit}`)
    if (createdBefore) params.push(`createdBefore=${createdBefore}`)

    const url = params.reduce((url, param, i) =>
      url + (i === 0 ? '?' : '&') + param,
      `/tasks`
    )

    const response = await HttpClient().get(url)
    return response.data.tasks
  }

  static async create(type, task) {
    if (type === TaskTypes.TechnicalStory) {
      return HttpClient().post(`/tasks/technicalStory`, task)
    } else if (type === TaskTypes.UserStory) {
      return HttpClient().post(`/tasks/userStory`, task)
    } else {
      return new Promise((_, rej) => rej(new Error('Incorrect task type provided')))
    }
  }

  static async findOne(taskId) {
    return HttpClient().get(`/task/${taskId}`)
  }

  static async update(task) {
    return HttpClient().put(`/task/${task.id}`, task)
  }

  static async toQa(taskId) {
    return HttpClient().put(`/task/${taskId}/toQa`)
  }

  static async complete(taskId) {
    return HttpClient().put(`/task/${taskId}/complete`)
  }

  static async delete(taskId) {
    return HttpClient().delete(`/task/${taskId}`)
  }

  static async archive(taskId) {
    return HttpClient().post(`/task/${taskId}/archive`)
  }

}

export default TaskService