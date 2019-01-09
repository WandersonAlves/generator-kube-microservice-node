import axios, { AxiosPromise, AxiosInstance, AxiosError } from 'axios';
import UpstreamConnectionException from '../exceptions/UpstreamConnectionException';

export default class RemoteController {

  private axios: AxiosInstance;

  constructor(remoteServiceAddress?: string) {
    this.axios = axios.create({
      baseURL: remoteServiceAddress
    });

    this.axios.interceptors.response.use(
      response => response,
      (err: AxiosError) => {
        throw new UpstreamConnectionException({ url: err.config.url }, err.message);
      }
    )
  }

  get(path: string, params?: any): AxiosPromise<any> {
    return this.axios.get(`${path}`, params);
  }

  post(path: string, params?: any): AxiosPromise<any> {
    return this.axios.post(`${path}`, params);
  }

  put(path: string, params?: any): AxiosPromise<any> {
    return this.axios.put(`${path}`, params);
  }

}