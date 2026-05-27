import axios, { AxiosError } from 'axios';
import Config from 'react-native-config';
import { getAccessToken, clearAllTokens } from '@/utils/storage';
import { store } from '@/store'; 
import { forceLogout } from '@/features/auth/store'; 

const BASE_URL = Config.API_BASE_URL || 'https://gason.co.in/demo/api';

const axiosClient = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Mutex lock to prevent multiple logout dispatches if concurrent requests fail
let isLoggingOut = false;

// --- Request Interceptor ---
axiosClient.interceptors.request.use(
  async (config) => {
    // 1. Inject Token
    const token = await getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 2. Log Request (Combined to ensure correct execution order)
    if (__DEV__) {
      console.log(`🚀 [API Req] ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
      if (config.data) {
        console.log('📦 [Req Data]:', JSON.stringify(config.data, null, 2));
      }
    }

    return config;
  }, 
  (error) => Promise.reject(error)
);

// --- Response Interceptor ---
axiosClient.interceptors.response.use(
  (response) => {
    // Log Success
    if (__DEV__) {
      console.log(`✅ [API Res] ${response.status} ${response.config.url}`);
    }
    return response;
  },
  async (error: AxiosError) => {
    const status = error.response?.status;
    const url = error.config?.url || 'Unknown URL';

    // Log Error
    if (__DEV__) {
      console.log(`❌ [API Err] ${status || 'NETWORK_ISSUE'} ${url}`);
      if (error.response?.data) {
        console.log('⚠️ [Err Data]:', JSON.stringify(error.response.data, null, 2));
      } else {
        console.log('⚠️ [Net Msg]:', error.message);
      }
    }

    // Handle 401 Unauthorized (Token expired/invalid)
    if (status === 401 && !isLoggingOut) {
      isLoggingOut = true;
      console.log('🚫 [Auth] 401 Unauthorized! Logging user out...');
      
      try {
        // Clear token and kick user out to the Login Screen
        await clearAllTokens();
        store.dispatch(forceLogout());
      } finally {
        // Reset the lock after a delay so subsequent failed requests in the same batch are ignored
        setTimeout(() => {
          isLoggingOut = false;
        }, 2000);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;