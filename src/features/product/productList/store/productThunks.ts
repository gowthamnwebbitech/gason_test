import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiService } from '@/api/apiService';
import { ProductResponse } from './productType';

// Fetch paginated products
export const fetchProducts = createAsyncThunk<
  ProductResponse,
  { offset: number },
  { rejectValue: string }
>('product/fetchProducts', async ({ offset }, { rejectWithValue }) => {
  try {
    return await apiService.get<ProductResponse>(`/products?offset=${offset}`);
  } catch (error: any) {
    return rejectWithValue(error.message || 'Failed to fetch products');
  }
});

export const searchProducts = createAsyncThunk<
  ProductResponse,
  { query: string },
  { rejectValue: string }
>('product/searchProducts', async ({ query }, { rejectWithValue }) => {
  try {
    return await apiService.get<ProductResponse>(`/products/${query}`);
  } catch (error: any) {
    return rejectWithValue(error.message || 'Failed to search products');
  }
});