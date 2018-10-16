import axios, { AxiosPromise } from 'axios';
import env from '../../config/env';
import UpstreamConnectionException from '../exceptions/UpstreamConnectionException';

export default class RemoteController {
  private _remoteServiceAddress: string;

  constructor(remoteServiceAddress?: string) {
    this._remoteServiceAddress = remoteServiceAddress || env.ingress_url;
    axios.interceptors.response.use(
      response => response,
      (err) => {
        throw new UpstreamConnectionException();
      }
    )
  }

  get(path: string, params?: any): AxiosPromise<any> {
    return axios.get(`${this._remoteServiceAddress}${path}`, params);
  }

  post(path: string, params?: any): AxiosPromise<any> {
    return axios.post(`${this._remoteServiceAddress}${path}`, params);
  }

  put(path: string, params?: any): AxiosPromise<any> {
    return axios.put(`${this._remoteServiceAddress}${path}`, params);
  }

}