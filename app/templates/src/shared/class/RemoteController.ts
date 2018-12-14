import axios, { AxiosPromise, AxiosError } from 'axios';
import env from '../../config/env';
import UpstreamConnectionException from '../exceptions/UpstreamConnectionException';

const axiosInstance = axios.create({
  baseURL: env.onpremise_url
});

axiosInstance.interceptors.response.use(
  response => response,
  (err: AxiosError) => {
    return Promise.reject(new UpstreamConnectionException({}, err.response.data.message || err.response.data));
  }
)

export default {
  get(path: string, params?: any): AxiosPromise<any> {
    return axiosInstance.get(`${path}`, params);
  },
  post(path: string, params?: any): AxiosPromise<any> {
    params ? params.token = env.onpremise_token : params = { token: env.onpremise_token };
    return axiosInstance.post(`${path}`, params);
  },
  put(path: string, params?: any): AxiosPromise<any> {
    params.token = env.onpremise_token;
    return axiosInstance.put(`${path}`);
  }
}