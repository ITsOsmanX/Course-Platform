import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor to handle transparent background token refreshing safely
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 🛑 CRITICAL PATCH: If the route that failed with a 401 WAS the refresh token route itself, 
    // do NOT attempt to refresh or redirect. Just reject immediately to prevent an infinite loop.
    if (originalRequest.url.includes('/auth/refresh')) {
      return Promise.reject(error);
    }

    // Check if the error is 401, isn't a login attempt, and hasn't been retried yet
    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url.includes('/auth/login')) {
      originalRequest._retry = true;

      try {
        const response = await axios.post(`${API_URL}/auth/refresh`, {}, { withCredentials: true });
        const { accessToken } = response.data;

        api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        // Only redirect to login if the user was actively trying to perform an authorized app action
        if (typeof window !== 'undefined' && !window.location.pathname.endsWith('/')) {
          window.location.href = '/auth/login?expired=true';
        }
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);