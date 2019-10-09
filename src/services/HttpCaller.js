import axios from 'axios';

import Config from '../config';
import AuthService from '../services/AuthenticationService';

const axiosInstance = () => axios.create({
  baseURL: Config.serverUrl,
  headers: { 'Authorization':  AuthService.getToken() }
});

export default {
  call: (options) => axiosInstance()(options)
};
