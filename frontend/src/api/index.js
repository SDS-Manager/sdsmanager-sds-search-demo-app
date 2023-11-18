import axios from 'axios';
export const BASE_API_URL = process.env.BASE_API_URL;

const axiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:8000',
  timeout: 50000,
  headers: {
    'Content-Type': 'application/json',
    // 'X-SDS-SEARCH-ACCESS-API-KEY': '',
    accept: 'application/json',
  },
});

export default axiosInstance;
