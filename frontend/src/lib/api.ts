import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

// In-memory token reference to avoid localStorage
let memoryToken: string | null = null;

export const setInMemoryToken = (token: string | null) => {
  memoryToken = token;
};

export const getInMemoryToken = () => memoryToken;

const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  withCredentials: true, // Crucial for httpOnly refresh cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach bearer token dynamically
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (memoryToken && config.headers) {
      config.headers.Authorization = `Bearer ${memoryToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 & Silent Token Refresh
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if error is 401 and hasn't been retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      // If we are hitting the refresh endpoint itself and it fails, wipe state
      if (originalRequest.url?.includes('/auth/refresh')) {
        setInMemoryToken(null);
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Hit the refresh endpoint (browser automatically attaches httpOnly cookie)
        const response = await api.post('/auth/refresh');
        const { accessToken } = response.data;

        setInMemoryToken(accessToken);
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        processQueue(null, accessToken);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        setInMemoryToken(null);
        
        // Custom window event to notify AuthContext to scrub state and redirect
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('auth-session-expired'));
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;