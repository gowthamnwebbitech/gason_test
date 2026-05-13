// src/features/auth/store/authThunks.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiService } from '@/api/apiService';
import {
  getAccessToken,
  setAccessToken,
  setRefreshToken,
  clearAllTokens,
  checkFirstLaunch,
  setAppLaunched,
} from '@/utils/storage';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { User } from './authTypes';

// 1. App Startup Check
export const initializeApp = createAsyncThunk(
  'auth/initializeApp',
  async () => {
    const [token, firstLaunch] = await Promise.all([
      getAccessToken(),
      checkFirstLaunch(),
    ]);
    return { isAuthenticated: !!token, isFirstLaunch: firstLaunch };
  },
);

// 2. Login Call
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (credentials: Record<string, string>, { rejectWithValue }) => {
    try {
      const response = await apiService.post<{
        access_token: string;
        refresh_token: string;
        user: User;
      }>('/auth/login', credentials);

      await setAccessToken(response.access_token);
      await setRefreshToken(response.refresh_token);

      return response.user;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Invalid email or password',
      );
    }
  },
);

// 3. Complete Onboarding
export const completeOnboarding = createAsyncThunk(
  'auth/completeOnboarding',
  async () => {
    await setAppLaunched();
    return false;
  },
);

export const googleLoginUser = createAsyncThunk(
  'auth/googleLoginUser',
  async (_, { rejectWithValue }) => {
    try {
      // 1. Check if device supports Google Play services
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });

      // 2. NEW WAY FOR v11+: Get the response, then extract idToken from data
      const response = await GoogleSignin.signIn();
      const idToken = response.data?.idToken;

      if (!idToken) {
        throw new Error('No ID token found');
      }

      // 3. Create a Firebase credential with the Google token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      // 4. Sign-in to Firebase with the credential
      const userCredential = await auth().signInWithCredential(
        googleCredential,
      );

      // 5. Format and return the user data for your Redux store
      const user: User = {
        id: userCredential.user.uid,
        name: userCredential.user.displayName || 'User',
        email: userCredential.user.email || '',
      };

      return user;
    } catch (error: any) {
      console.error('Firebase Google Auth Error:', error);
      return rejectWithValue(error.message || 'Google authentication failed');
    }
  },
);

export const logoutUser = createAsyncThunk('auth/logoutUser', async () => {
  await auth().signOut();
  await GoogleSignin.signOut();
  // await clearAllTokens();
});
