import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  getAccessToken,
  setAccessToken,
  clearAllTokens,
  checkFirstLaunch,
  setAppLaunched,
  getLocalUser,
  setLocalUser,
  removeLocalUser
} from '@/utils/storage';
import { User, Role } from './authTypes';
import apiService from '@/api/axiosClient';

// INITIALIZE APP (REHYDRATION)
export const initializeApp = createAsyncThunk('auth/initializeApp', async () => {
  console.log('[AuthThunk: initializeApp] Starting initialization sequence...');
  
  const [token, firstLaunch, userProfile] = await Promise.all([
    getAccessToken(),
    checkFirstLaunch(),
    getLocalUser(),
  ]);

  console.log('[AuthThunk: initializeApp] Storage retrieval complete.', { 
    hasToken: !!token, 
    firstLaunch, 
    hasUserProfile: !!userProfile 
  });

  const isValidSession = !!token && !!userProfile;
  
  if (!!token && !userProfile) {
    console.warn('[AuthThunk: initializeApp] Found token but no user profile. Clearing corrupted session.');
    await clearAllTokens();
  }

  console.log('[AuthThunk: initializeApp] Initialization finished.', { isAuthenticated: isValidSession });
  
  return { 
    isAuthenticated: isValidSession, 
    isFirstLaunch: firstLaunch,
    user: isValidSession ? userProfile : null 
  };
});

// DYNAMIC LOGIN (Handles 1 = member, 0 = user from backend)
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (
    credentials: { identifier: string; password: string; role: Role }, 
    { rejectWithValue }
  ) => {
    try {
      console.log(`[AuthThunk: loginUser] Attempting login for role: [${credentials.role}] with identifier: [${credentials.identifier}]`);
      
      const endpoint = credentials.role === 'member' ? '/member/login' : '/customer/login';
      const payload = credentials.role === 'member' 
        ? { member_id: credentials.identifier, password: credentials.password } 
        : { phone: credentials.identifier, password: credentials.password };

      console.log(`[AuthThunk: loginUser] Making API request to endpoint: ${endpoint}`);

      // Make API Call
      const response = await apiService.post(endpoint, payload);
      console.log('[AuthThunk: loginUser] Raw API Response:', response.data);
      
      if (!response.data || !response.data.success) {
        console.warn('[AuthThunk: loginUser] Login flagged as unsuccessful by backend server.');
        throw new Error(response.data?.message || "Login failed");
      }

      // Extract the user data directly from your JSON format
      const userData = response.data.member || response.data.user || response.data.customer;
      if (!userData) {
        console.error('[AuthThunk: loginUser] Could not locate user/member/customer object in response.');
        throw new Error("Invalid server response format.");
      }

      // CRITICAL: Map backend role ("1" or "0") to app state ("member" or "user")
      const backendRole = String(response.data.role); 
      const assignedRole: Role = backendRole === '1' ? 'member' : 'user';
      console.log(`[AuthThunk: loginUser] Role Mapping - Backend provided: [${backendRole}] -> Assigned App Role: [${assignedRole}]`);

      // Stamp the localized role onto the user profile
      const userWithRole: User = { ...userData, role: assignedRole };

      console.log('[AuthThunk: loginUser] Saving session token and local user profile...');
      await setAccessToken(response.data.token);
      await setLocalUser(userWithRole); 
      
      console.log('[AuthThunk: loginUser] Login sequence completed successfully.');
      return userWithRole;
    } catch (error: any) {
      console.error('[AuthThunk: loginUser] Error caught during login:', error.response?.data || error.message || error);
      return rejectWithValue(error.response?.data?.message || error.message || 'Login failed. Please check your credentials.');
    }
  }
);

// REGISTRATION (Users only)
export const signupUser = createAsyncThunk(
  'auth/signupUser',
  async (
    userData: { name: string; phone: string; email: string; password: string; role?: Role }, 
    { rejectWithValue }
  ) => {
    try {
      console.log(`[AuthThunk: signupUser] Attempting registration for phone: ${userData.phone}`);
      
      const response = await apiService.post<{ user: User; success: boolean }>('/customer/register', userData);
      console.log('[AuthThunk: signupUser] API Response:', response.data);
      
      return response.data.user;
    } catch (error: any) {
      console.error('[AuthThunk: signupUser] Error caught during registration:', error.response?.data || error.message || error);
      return rejectWithValue(error.response?.data?.message || 'Registration failed.');
    }
  }
);

// LOGOUT
export const logoutUser = createAsyncThunk('auth/logoutUser', async (_, { rejectWithValue }) => {
  console.log('[AuthThunk: logoutUser] Initiating logout sequence...');
  try {
    const response = await apiService.post('/logout'); 
    console.log('[AuthThunk: logoutUser] Server logout request successful.', response.data);
  } catch (error: any) {
    console.warn('[AuthThunk: logoutUser] Server logout failed, proceeding with local device cleanup.', error.response?.data || error.message);
  } finally {
    console.log('[AuthThunk: logoutUser] Clearing local user data and tokens from device storage...');
    await removeLocalUser();
    await clearAllTokens();
    console.log('[AuthThunk: logoutUser] Local device cleanup complete.');
  }
});

// UTILITY THUNKS (Users only)
export const verifySignupOtp = createAsyncThunk(
  'auth/verifySignupOtp',
  async (data: { user_id: string; otp: string }, { rejectWithValue }) => {
    try {
      console.log(`[AuthThunk: verifySignupOtp] Attempting OTP verification for user_id: ${data.user_id} with OTP: ${data.otp}`);
      
      const response = await apiService.post('/customer/verify', data);
      console.log('[AuthThunk: verifySignupOtp] API Response:', response.data);
      
      return response.data;
    } catch (error: any) {
      console.error('[AuthThunk: verifySignupOtp] Error caught during verification:', error.response?.data || error.message || error);
      return rejectWithValue(error.response?.data?.message || 'Invalid OTP.');
    }
  }
);

// FORGOT PASSWORD (Strictly for Users/Customers since members only have login)
export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (phone: string, { rejectWithValue }) => {
    try {
      console.log(`[AuthThunk: forgotPassword] Initiating forgot password request for phone: ${phone}`);
      
      const response = await apiService.post('/customer/forgot-password', { phone });
      console.log('[AuthThunk: forgotPassword] API Response:', response.data);
      
      return response.data;
    } catch (error: any) {
      console.error('[AuthThunk: forgotPassword] Error caught during forgot password request:', error.response?.data || error.message || error);
      return rejectWithValue(error.response?.data?.message || 'Account not found.');
    }
  }
);

// RESET PASSWORD (Strictly for Users/Customers)
export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (data: { phone: string; otp: string; password: string }, { rejectWithValue }) => {
    try {
      console.log(`[AuthThunk: resetPassword] Attempting password reset for phone: ${data.phone} with provided OTP.`);
      
      const response = await apiService.post('/customer/reset-password', data);
      console.log('[AuthThunk: resetPassword] API Response:', response.data);
      
      return response.data;
    } catch (error: any) {
      console.error('[AuthThunk: resetPassword] Error caught during password reset:', error.response?.data || error.message || error);
      return rejectWithValue(error.response?.data?.message || 'Password reset failed.');
    }
  }
);

export const completeOnboarding = createAsyncThunk('auth/completeOnboarding', async () => {
  console.log('[AuthThunk: completeOnboarding] Marking First Launch onboarding as complete in storage.');
  await setAppLaunched();
  return false;
});