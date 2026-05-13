// src/features/auth/store/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, User } from './authTypes';
// MUST import googleLoginUser here:
import { initializeApp, loginUser, completeOnboarding, logoutUser, googleLoginUser } from './authThunks';

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isAppReady: false,
  isFirstLaunch: true,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    forceLogout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // --- Initialize App ---
      .addCase(initializeApp.fulfilled, (state, action) => {
        state.isAuthenticated = action.payload.isAuthenticated;
        state.isFirstLaunch = action.payload.isFirstLaunch;
        state.isAppReady = true;
      })
      // --- Email/Password Login ---
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // --- Google Login ---
      .addCase(googleLoginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(googleLoginUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(googleLoginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // --- Complete Onboarding ---
      .addCase(completeOnboarding.fulfilled, (state, action) => {
        state.isFirstLaunch = action.payload;
      })
      // --- Logout ---
      .addCase(logoutUser.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
      });
  },
});

export const { forceLogout } = authSlice.actions;
export default authSlice.reducer;