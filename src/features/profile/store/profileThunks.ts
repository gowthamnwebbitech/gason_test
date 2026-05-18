import { createAsyncThunk } from '@reduxjs/toolkit';
import apiService from '@/api/axiosClient';
import { UserProfile } from './profileTypes';

export const fetchProfile = createAsyncThunk(
  'profile/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiService.get<{ success: boolean; data: UserProfile }>('/member/profile');
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to load profile data.'
      );
    }
  }
);