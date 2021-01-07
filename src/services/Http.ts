import axios, { AxiosRequestConfig } from 'axios';

class Http {
  private API_HOST_URL: string;
  private defaultRequestConfig: AxiosRequestConfig;

  constructor() {
    this.API_HOST_URL = 'https://cluby-assignment-api.com';
    this.defaultRequestConfig = {
      headers: {
        ClubyApiKey: process.env.REACT_APP_CLUBY_API_KEY,
      },
    };
  }

  private request(path: string, options: AxiosRequestConfig) {
    return axios({
      ...this.defaultRequestConfig,
      ...options,
      headers: {
        ...this.defaultRequestConfig.headers,
        ...options.headers,
      },
      url: `${this.API_HOST_URL}${path}`,
    });
  }

  public get(path: string, config: AxiosRequestConfig = {}) {
    return this.request(path, {
      ...config,
      method: 'GET',
    });
  }

  public post(path: string, data: any, config: AxiosRequestConfig = {}) {
    return this.request(path, {
      ...config,
      method: 'POST',
      data,
    });
  }
}
const http = new Http();
export default http;
