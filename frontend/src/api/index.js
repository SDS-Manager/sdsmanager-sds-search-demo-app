import axios from 'axios';
import { renderSnackbar } from 'utils/renderSnackbar';
export const BASE_API_URL = process.env.BASE_API_URL;

const axiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:8000',
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
