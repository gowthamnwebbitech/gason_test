import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProfileState, UserProfile } from './profileTypes';
import { fetchProfile } from './profileThunks';
import { logoutUser } from '@/features/auth/store'; // Import logout to clear profile

const initialState: ProfileState = {
  data: null,
  isLoading: false,
  error: null,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action: PayloadAction<UserProfile>) => {
        state.isLoading = false;
        state.data = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Clear profile data when the user logs out
      .addCase(logoutUser.fulfilled, (state) => {
        state.data = null;
        state.error = null;
      });
  },
});

export default profileSlice.reducer;