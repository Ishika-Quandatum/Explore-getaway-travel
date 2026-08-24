import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
  ? (import.meta.env.VITE_API_BASE_URL.endsWith('/') ? import.meta.env.VITE_API_BASE_URL : `${import.meta.env.VITE_API_BASE_URL}/`)
  : 'http://127.0.0.1:8000/api/';

export const getImageUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    try {
      const parsedUrl = new URL(url);
      if (parsedUrl.hostname === '127.0.0.1' || parsedUrl.hostname === 'localhost') {
        const apiHost = new URL(API_BASE_URL).origin;
        return `${apiHost}${parsedUrl.pathname}${parsedUrl.search}`;
      }
    } catch (e) {
      // ignore
    }
    return url;
  }
  if (url.startsWith('/media/')) {
    const apiHost = new URL(API_BASE_URL).origin;
    return `${apiHost}${url}`;
  }
  return url;
};

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refresh_token');

      if (refreshToken) {
        try {
          const res = await axios.post(`${API_BASE_URL}auth/refresh/`, {
            refresh: refreshToken,
          });
          localStorage.setItem('access_token', res.data.access);
          originalRequest.headers.Authorization = `Bearer ${res.data.access}`;
          return axios(originalRequest);
        } catch (refreshError) {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('user');
          window.dispatchEvent(new Event('auth_change'));
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
