import axios, {
  AxiosPromise,
  AxiosInstance,
  AxiosError,
  AxiosRequestConfig,
} from 'axios';
import UpstreamConnectionException from '../exceptions/UpstreamConnectionException';

export default class RemoteController {
  private axios: AxiosInstance;

  constructor(remoteServiceAddress?: string) {
    this.axios = axios.create({
      baseURL: remoteServiceAddress,
    });

    this.axios.interceptors.request.use(request => {
      return request;
    });

    this.axios.interceptors.response.use(
      response => response,
      (err: AxiosError) => {
        throw new UpstreamConnectionException(
          { url: err.config.url },
          err.message,
          err.response.status,
        );
      },
    );
  }

  get(path: string, params?: AxiosRequestConfig): AxiosPromise<any> {
    return this.axios.get(path, params);
  }

  post(path: string, params?: any, config?: AxiosRequestConfig): AxiosPromise<any> {
    return this.axios.post(path, params, config);
  }

  put(path: string, params?: any, config?: AxiosRequestConfig): AxiosPromise<any> {
    return this.axios.put(path, params, config);
  }
}
