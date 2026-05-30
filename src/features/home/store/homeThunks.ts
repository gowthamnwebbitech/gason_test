import { createAsyncThunk } from '@reduxjs/toolkit';
import apiService from '@/api/axiosClient';
import { HomeData } from './homeTypes';

export const fetchHomeData = createAsyncThunk(
  'home/fetchHomeData',
  async (isRefresh: boolean = false, { rejectWithValue }) => {
    try {
      const response = await apiService.get
      (
        '/customer/dashboard'
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch home data.');
    }
  }
);