import axios from 'axios';
import { renderSnackbar } from 'utils/renderSnackbar';
import { getEnv } from 'utils/getEnv';

const SDS_DEMO_URL = 'https://api.sdsmanager.com';
const SDS_DEMO_RC_URL = 'https://rc-demo.sdsmanager.com';
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
  (error) => {
    if (error.response.status === 403) {
      return Promise.reject(error);
    }

    if (error.response?.data?.detail !== undefined) {
      if (typeof error.response?.data?.detail == 'string') {
        renderSnackbar([error.response.data.detail]);
      }
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
