import HttpClient from './HttpClient'

class UserService {

  async fetchCurrentUserProfile() {
    const response = await HttpClient().get(`/user`)
    return response.data
  }

  async getUserFromId(id) {
    const response = await HttpClient().get(`/user/${id}`)
    return response.data
  }

}

export default new UserService()