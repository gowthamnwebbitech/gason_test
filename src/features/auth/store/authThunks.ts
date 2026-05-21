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
import { User } from './authTypes';
import apiService from '@/api/axiosClient';

// ==========================================
// INITIALIZE APP (REHYDRATION)
// ==========================================
export const initializeApp = createAsyncThunk('auth/initializeApp', async () => {
  // Fetch token, first launch status, AND the saved user profile from device memory
  const [token, firstLaunch, userProfile] = await Promise.all([
    getAccessToken(),
    checkFirstLaunch(),
    getLocalUser(),
  ]);

  // SAFETY NET: If the user has a token but no profile data is saved, 
  // the session is broken. Clear it to force a fresh login.
  const isValidSession = !!token && !!userProfile;
  
  if (!!token && !userProfile) {
    console.warn('⚠️ Found token but no user profile. Clearing corrupted session.');
    await clearAllTokens();
  }

  return { 
    isAuthenticated: isValidSession, 
    isFirstLaunch: firstLaunch,
    user: isValidSession ? userProfile : null // Safely return user back to the Redux Slice
  };
});

// ==========================================
// LOGIN & REGISTRATION
// ==========================================
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials: { phone: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await apiService.post<{ token: string; member: User; success: boolean }>('/member/login', credentials);
      
      await setAccessToken(response.data.token);
      await setLocalUser(response.data.member); 
      
      return response.data.member;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Login failed.');
    }
  }
);

export const signupUser = createAsyncThunk(
  'auth/signupUser',
  async (userData: { name: string; phone: string; email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await apiService.post<{ user: User; success: boolean }>('/member/register', userData);
      
      // If your API automatically logs the user in on signup, save them to storage:
      // await setLocalUser(response.data.user); 
      
      return response.data.user;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed.');
    }
  }
);

// ==========================================
// LOGOUT
// ==========================================
export const logoutUser = createAsyncThunk('auth/logoutUser', async (_, { rejectWithValue }) => {
  try {
    await apiService.post('/member/logout');
  } catch (error: any) {
    console.warn('Server logout failed, proceeding with local logout', error);
  } finally {
    await removeLocalUser(); // 🗑️ WIPE USER FROM DEVICE ON LOGOUT
    await clearAllTokens();
  }
});

// ==========================================
// OTHER THUNKS
// ==========================================
export const verifySignupOtp = createAsyncThunk(
  'auth/verifySignupOtp',
  async (data: { user_id: string; otp: string }, { rejectWithValue }) => {
    try {
      const response = await apiService.post('/member/verify', data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Invalid OTP.');
    }
  }
);

export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (phone: string, { rejectWithValue }) => {
    try {
      const response = await apiService.post('/member/forgot-password', { phone });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Phone not found.');
    }
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (data: { phone: string; otp: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await apiService.post('/member/reset-password', data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Reset failed.');
    }
  }
);

export const completeOnboarding = createAsyncThunk('auth/completeOnboarding', async () => {
  await setAppLaunched();
  return false;
});