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
  const [token, firstLaunch, userProfile] = await Promise.all([
    getAccessToken(),
    checkFirstLaunch(),
    getLocalUser(),
  ]);

  const isValidSession = !!token && !!userProfile;
  
  if (!!token && !userProfile) {
    await clearAllTokens();
  }

  return { 
    isAuthenticated: isValidSession, 
    isFirstLaunch: firstLaunch,
    user: isValidSession ? userProfile : null 
  };
});

// DYNAMIC LOGIN
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (
    credentials: { identifier: string; password: string; role: Role }, 
    { rejectWithValue }
  ) => {
    try {
      const endpoint = credentials.role === 'member' ? '/member/login' : '/customer/login';
      const payload = credentials.role === 'member' 
        ? { member_id: credentials.identifier, password: credentials.password } 
        : { phone: credentials.identifier, password: credentials.password };

      const response = await apiService.post(endpoint, payload);
      
      if (!response.data || !response.data.success) {
        throw new Error(response.data?.message || "Login failed");
      }

      const userData = response.data.member || response.data.user || response.data.customer;
      if (!userData) throw new Error("Invalid server response format.");

      const backendRole = String(response.data.role); 
      const assignedRole: Role = backendRole === '1' ? 'member' : 'user';

      const userWithRole: User = { ...userData, role: assignedRole };

      await setAccessToken(response.data.token);
      await setLocalUser(userWithRole); 
      
      return userWithRole;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Login failed. Please check your credentials.');
    }
  }
);

// UPDATE MEMBER ID (NEW BLOCK)
export const updateMemberId = createAsyncThunk(
  'auth/updateMemberId',
  async (
    data: { member_id: string; customer_id: string | number }, 
    { getState, rejectWithValue }
  ) => {
    try {
      const response = await apiService.post('/customer/update/member', data);
      
      if (!response.data || !response.data.success) {
        throw new Error(response.data?.message || 'Member does not exist or is inactive');
      }
      
      // Update local storage so the session persists across app restarts
      const state = getState() as any;
      const currentUser = state.auth.user;
      if (currentUser) {
        const updatedUser = { ...currentUser, member_id: data.member_id };
        await setLocalUser(updatedUser);
      }
      
      return data.member_id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to update Member ID');
    }
  }
);

// REGISTRATION
export const signupUser = createAsyncThunk(
  'auth/signupUser',
  async (
    userData: { name: string; phone: string; email: string; member_id: string; password: string; role?: Role }, 
    { rejectWithValue }
  ) => {
    try {
      const response = await apiService.post<{ user: User; success: boolean }>('/customer/register', userData);
      return response.data.user;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed.');
    }
  }
);

// LOGOUT
export const logoutUser = createAsyncThunk('auth/logoutUser', async (_, { rejectWithValue }) => {
  try {
    await apiService.post('/logout'); 
  } catch (error: any) {
    console.warn('[AuthThunk: logoutUser] Server logout failed', error.message);
  } finally {
    await removeLocalUser();
    await clearAllTokens();
  }
});

// UTILITY THUNKS
export const verifySignupOtp = createAsyncThunk(
  'auth/verifySignupOtp',
  async (data: { user_id: string; otp: string }, { rejectWithValue }) => {
    try {
      const response = await apiService.post('/customer/verify', data);
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
      const response = await apiService.post('/customer/forgot-password', { phone });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Account not found.');
    }
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (data: { phone: string; otp: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await apiService.post('/customer/reset-password', data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Password reset failed.');
    }
  }
);

export const completeOnboarding = createAsyncThunk('auth/completeOnboarding', async () => {
  await setAppLaunched();
  return false;
});