import axios from 'axios'

import AuthenticationService from './AuthenticationService'
import { serverUrl } from '../../config'

function errorResponseInterceptor(error) {
  if (error.response.status === 401) {
    AuthenticationService.currentTokenWasRefusedByApi()
    window.location.replace('/login')
  }
  return Promise.reject(error)
}

axios.interceptors.response.use(
  undefined,
  errorResponseInterceptor,
)

export default () => {
  const client = axios.create({
    baseURL: serverUrl,
    headers: {
      Authorization: AuthenticationService.getToken(),
      Accept: 'application/json',
    },
  })

  client.interceptors.response.use(
    undefined,
    errorResponseInterceptor,
  )

  return client
}
