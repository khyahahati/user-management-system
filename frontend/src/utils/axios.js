import axios from 'axios';

const rawApiBaseUrl = import.meta.env.VITE_API_BASE_URL;

if (!rawApiBaseUrl) {
  throw new Error('VITE_API_BASE_URL is not defined');
}

export const API_BASE_URL = rawApiBaseUrl.replace(/\/+$/, '');

export const buildApiUrl = (path) => {
  if (!path.startsWith('/')) {
    throw new Error('API paths must start with a leading slash');
  }
  return `${API_BASE_URL}${path}`;
};

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = window.localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    if (status === 401) {
      window.localStorage.removeItem('token');
      window.localStorage.removeItem('user');

      if (window.location.pathname !== '/login') {
        window.location.replace('/login');
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;
