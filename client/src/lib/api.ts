import axios from 'axios';
import Cookies from 'js-cookie';
import { AUTH_COOKIE } from './constants';

export { AUTH_COOKIE };

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api',
});

// The cookie (not localStorage) is what the middleware reads for route
// protection, so it also has to be what every request authenticates with.
api.interceptors.request.use((config) => {
  const token = Cookies.get(AUTH_COOKIE);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// A 401 mid-session means the token expired or the account was deleted -
// bounce to login rather than letting every query on the page fail silently.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      Cookies.remove(AUTH_COOKIE);
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);

export default api;
