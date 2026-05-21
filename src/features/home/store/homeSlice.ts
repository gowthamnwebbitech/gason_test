import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { HomeState, HomeData } from './homeTypes';
import { fetchHomeData } from './homeThunks';

const initialState: HomeState = {
  data: null,
  isLoading: false,
  isRefreshing: false,
  error: null,
};

const homeSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {
    clearHomeData: (state) => {
      state.data = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHomeData.pending, (state, action) => {
        // If it's a pull-to-refresh, don't trigger the main loading spinner
        if (action.meta.arg === true) {
          state.isRefreshing = true;
        } else {
          state.isLoading = true;
        }
        state.error = null;
      })
      .addCase(fetchHomeData.fulfilled, (state, action: PayloadAction<HomeData>) => {
        state.isLoading = false;
        state.isRefreshing = false;
        state.data = action.payload;
      })
      .addCase(fetchHomeData.rejected, (state, action) => {
        state.isLoading = false;
        state.isRefreshing = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearHomeData } = homeSlice.actions;
export default homeSlice.reducer;