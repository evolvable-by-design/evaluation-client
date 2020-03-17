import HttpClient from './HttpClient'

class AnalyticsService {

  async findOne(id) {
    const response = await HttpClient().get(`/analytics/${id}`)
    return response.data
  }

}

export default new AnalyticsService()