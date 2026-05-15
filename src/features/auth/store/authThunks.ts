import { createAsyncThunk } from '@reduxjs/toolkit';

import {
  getAccessToken,
  setAccessToken,
  setRefreshToken,
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
      const response = await apiService.post<{
        access_token: string;
        refresh_token: string;
        user: User;
      }>('/member/login', credentials);

      await setAccessToken(response.data.access_token);
      await setRefreshToken(response.data.refresh_token);
      return response.data.user;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Invalid phone number or password. Please try again.'
      );
    }
  }
);

export const signupUser = createAsyncThunk(
  'auth/signupUser',
  async (userData: { name: string; phone: string; email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await apiService.post<{
        access_token?: string;
        refresh_token?: string;
        user: User;
        message?: string;
      }>('/member/register', userData);

      if (response.data.access_token) {
        await setAccessToken(response.data.access_token);
        if (response.data.refresh_token) await setRefreshToken(response.data.refresh_token);
      }

      return response.data.user || userData; 
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Registration failed. Please try again.'
      );
    }
  }
);

export const completeOnboarding = createAsyncThunk('auth/completeOnboarding', async () => {
  await setAppLaunched();
  return false;
});

export const logoutUser = createAsyncThunk('auth/logoutUser', async () => {
  await clearAllTokens();
});