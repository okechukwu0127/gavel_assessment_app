import ENV from './env';
import Axios, { AxiosRequestConfig } from 'axios';
import { log, error } from './helpers';
import { Platform } from 'react-native';

const get = async (url:string, params:any={}) => {

  let config = <AxiosRequestConfig>{
    'baseURL': ENV.BACKEND_URL,
    'url': url,
    'method': 'get',
    'params': {...params, 'os': Platform.OS},
    'responseType': 'json'
  }

  log('API get '+url);
  return Axios.get(url, config);
}


export default {
  'get': get
};