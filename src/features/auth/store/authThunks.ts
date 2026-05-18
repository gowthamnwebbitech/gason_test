// src/features/auth/store/authThunks.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  getAccessToken,
  setAccessToken,
  clearAllTokens,
  checkFirstLaunch,
  setAppLaunched,
} from '@/utils/storage';
import { User } from './authTypes';
import apiService from '@/api/axiosClient';

export const initializeApp = createAsyncThunk('auth/initializeApp', async () => {
  const [token, firstLaunch] = await Promise.all([getAccessToken(), checkFirstLaunch()]);
  return { isAuthenticated: !!token, isFirstLaunch: firstLaunch };
});

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials: { phone: string; password: string }, { rejectWithValue }) => {
    try {
      // Endpoint: /member/login
      const response = await apiService.post<{ token: string; member: User; success: boolean }>('/member/login', credentials);
      await setAccessToken(response.data.token);
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
      // Endpoint: /member/register
      const response = await apiService.post<{ user: User; success: boolean }>('/member/register', userData);
      return response.data.user; // Returns user so we can get user_id for OTP verify
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed.');
    }
  }
);

export const verifySignupOtp = createAsyncThunk(
  'auth/verifySignupOtp',
  async (data: { user_id: string; otp: string }, { rejectWithValue }) => {
    try {
      // Endpoint: /member/verify
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
      // Endpoint: /member/forgot-password
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
      // Endpoint: /member/reset-password
      const response = await apiService.post('/member/reset-password', data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Reset failed.');
    }
  }
);

export const completeOnboarding = createAsyncThunk('auth/completeOnboarding', async () => {
  await setAppLaunched();
  return false; // Sets isFirstLaunch to false
});

export const logoutUser = createAsyncThunk('auth/logoutUser', async () => {
  await clearAllTokens();
});