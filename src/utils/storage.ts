import * as Keychain from 'react-native-keychain';
import AsyncStorage from '@react-native-async-storage/async-storage';

// --- Constants ---
const AUTH_TOKEN_SERVICE = 'gason_auth_token';
const HAS_LAUNCHED_KEY = '@gason_has_launched';
const USER_PROFILE_KEY = '@gason_user_profile';

// ==========================================
// 1. ONBOARDING (WELCOME SCREEN) STORAGE
// ==========================================

export const checkFirstLaunch = async (): Promise<boolean> => {
  try {
    const hasLaunched = await AsyncStorage.getItem(HAS_LAUNCHED_KEY);
    return hasLaunched === null;
  } catch (error) {
    console.error('Error reading launch status:', error);
    return true; 
  }
};

export const setAppLaunched = async (): Promise<void> => {
  try {
    await AsyncStorage.setItem(HAS_LAUNCHED_KEY, 'true');
  } catch (error) {
    console.error('Error saving launch status:', error);
  }
};

// ==========================================
// 2. SECURE API TOKEN STORAGE (KEYCHAIN)
// ==========================================

export const setAccessToken = async (token: string): Promise<void> => {
  try {
    console.log('🔑 [Storage] Saving New Access Token:', token);
    await Keychain.setGenericPassword('auth', token, { service: AUTH_TOKEN_SERVICE });
  } catch (error) {
    console.error('❌ [Storage] Error saving access token:', error);
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  try {
    const creds = await Keychain.getGenericPassword({ service: AUTH_TOKEN_SERVICE });
    if (creds) {
      console.log('🔓 [Storage] Retrieved Token Successfully');
      return creds.password;
    }
    console.log('🔒 [Storage] No Token Found');
    return null;
  } catch (error) {
    console.error('❌ [Storage] Error reading access token:', error);
    return null;
  }
};

export const clearAllTokens = async (): Promise<void> => {
  try {
    console.log('🗑️ [Storage] Clearing Tokens (User Logged Out)');
    await Keychain.resetGenericPassword({ service: AUTH_TOKEN_SERVICE });
  } catch (error) {
    console.error('❌ [Storage] Error clearing tokens:', error);
  }
};

// ==========================================
// 3. USER PROFILE STORAGE (ASYNC STORAGE)
// ==========================================

export const setLocalUser = async (user: any): Promise<void> => {
  try {
    await AsyncStorage.setItem(USER_PROFILE_KEY, JSON.stringify(user));
  } catch (error) {
    console.error('❌ [Storage] Error saving user profile:', error);
  }
};

export const getLocalUser = async (): Promise<any | null> => {
  try {
    const data = await AsyncStorage.getItem(USER_PROFILE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('❌ [Storage] Error reading user profile:', error);
    return null;
  }
};

export const removeLocalUser = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(USER_PROFILE_KEY);
  } catch (error) {
    console.error('❌ [Storage] Error removing user profile:', error);
  }
};