// src/api/apiService.ts (or your current filename)
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import Config from 'react-native-config';
import { 
  getAccessToken, 
  getRefreshToken, 
  setAccessToken, 
  setRefreshToken, 
  clearAllTokens 
} from '@/utils/storage';

// 1. Fallback URL to prevent silent failures if react-native-config is broken
// Make sure this matches your exact backend endpoint path
const BASE_URL = Config.API_BASE_URL || 'https://gason.co.in/demo/api/';

export const apiService = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// --- Refresh Queue State ---
let isRefreshing = false;
let failedQueue: Array<{ resolve: (token: string) => void; reject: (error: any) => void }> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) promise.reject(error);
    else promise.resolve(token!);
  });
  failedQueue = [];
};

// --- 2. Request Interceptor (Inject Token) ---
apiService.interceptors.request.use(async (config) => {
  const token = await getAccessToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => Promise.reject(error));

// --- 3. Response Interceptor (Handle 401 & Token Refresh) ---
apiService.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // If the error is 401 Unauthorized and we haven't retried yet
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      
      // If a refresh is already happening, queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiService(originalRequest); // Replay request
        }).catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = await getRefreshToken();
        if (!refreshToken) throw new Error("No refresh token available");

        // Request a new token using pure axios (to avoid infinite interceptor loops)
        const response = await axios.post(`${BASE_URL}member/refresh`, { // Update endpoint if needed
          refresh_token: refreshToken,
        });

        const newAccessToken = response.data.access_token;
        const newRefreshToken = response.data.refresh_token; 

        // Save new tokens securely
        await setAccessToken(newAccessToken);
        if (newRefreshToken) await setRefreshToken(newRefreshToken);

        // Update default headers and process the queue
        apiService.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
        processQueue(null, newAccessToken);

        // Replay the original failed request
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiService(originalRequest);

      } catch (refreshError) {
        // The refresh token is invalid or expired. The user MUST log in again.
        processQueue(refreshError, null);
        await clearAllTokens();
        
        // Note: You should trigger a global state change here to log the user out visually.
        // Example: store.dispatch(forceLogout());
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// --- 4. Development Console Loggers (Fixes "Network not showing") ---
if (__DEV__) {
  apiService.interceptors.request.use(request => {
    console.log(`🚀 [API Request] ${request.method?.toUpperCase()} ${request.baseURL}${request.url}`);
    if (request.data) {
      console.log('📦 [Request Payload]:', JSON.stringify(request.data, null, 2));
    }
    return request;
  });

  apiService.interceptors.response.use(
    response => {
      console.log(`✅ [API Response] ${response.status} ${response.config.url}`);
      return response;
    }, 
    error => {
      console.log(`❌ [API Error] ${error.response?.status} ${error.config?.url}`);
      if (error.response?.data) {
        console.log('⚠️ [Error Details]:', JSON.stringify(error.response.data, null, 2));
      } else {
        console.log('⚠️ [Network Error]:', error.message);
      }
      return Promise.reject(error);
    }
  );
}

export default apiService;