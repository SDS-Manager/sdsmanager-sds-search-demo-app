import axios from 'axios';
import { renderSnackbar } from 'utils/renderSnackbar';
import { getEnv } from 'utils/getEnv';

const SDS_DEMO_URL = 'https://api.sdsmanager.com';
const SDS_DEMO_RC_URL = 'https://rc-api.sdsmanager.com';
const SDS_DEMO_STAGING_URL = 'https://staging-demo.sdsmanager.com';

const workingEnv = getEnv();

export const BACKEND_URL =
  workingEnv === 'production'
    ? SDS_DEMO_URL
    : workingEnv === 'rc'
    ? SDS_DEMO_RC_URL
    : workingEnv === 'staging'
    ? SDS_DEMO_STAGING_URL
    : 'http://127.0.0.1:8003';


const axiosInstance = axios.create({
  baseURL: BACKEND_URL,
  timeout: 600000,
  headers: {
    'Content-Type': 'application/json',
    // 'X-SDS-SEARCH-ACCESS-API-KEY': '',
    accept: 'application/json',
  },
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (!error.response) {
      return Promise.reject(error);
    }
    if (error.response.status === 403) {
      return Promise.reject(error);
    }
    let data = error.response.data;
    try {
      //if data is a Blob, parse it to JSON
      if (data instanceof Blob) {
        const text = await data.text();
        data = JSON.parse(text);
      }

      if (data?.detail) {
        if (typeof data.detail === 'string') {
          renderSnackbar([data.detail]);
        } else if (Array.isArray(data.detail)) {
          const messages = data.detail.map((item) =>
            typeof item === 'string' ? item : item.msg
          );
          renderSnackbar(messages);
        }
      }
    } catch (e) {
      console.log('Could not parse error blob', e);
    }
    return Promise.reject(error);
  }

);

export default axiosInstance;
