import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, User } from './authTypes';
import { initializeApp, loginUser, completeOnboarding, logoutUser, signupUser, updateMemberId } from './authThunks';

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
      // --- APP INITIALIZATION ---
      .addCase(initializeApp.fulfilled, (state, action) => {
        state.isAuthenticated = action.payload.isAuthenticated;
        state.isFirstLaunch = action.payload.isFirstLaunch;
        state.user = action.payload.user;
        state.isAppReady = true;
      })
      
      // --- LOGIN ---
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

      // --- UPDATE MEMBER ID (NEW) ---
      .addCase(updateMemberId.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateMemberId.fulfilled, (state, action) => {
        state.isLoading = false;
        if (state.user) {
          state.user.member_id = action.payload; 
        }
      })
      .addCase(updateMemberId.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // --- SIGNUP ---
      .addCase(signupUser.pending, (state) => { 
        state.isLoading = true; 
        state.error = null; 
      })
      .addCase(signupUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.isLoading = false;
        state.user = action.payload; 
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // --- ONBOARDING ---
      .addCase(completeOnboarding.fulfilled, (state, action) => { 
        state.isFirstLaunch = action.payload; 
      })
      
      // --- LOGOUT ---
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true; 
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;               
      })
      .addCase(logoutUser.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;              
      });
  },
});

export const { forceLogout } = authSlice.actions;
export default authSlice.reducer;