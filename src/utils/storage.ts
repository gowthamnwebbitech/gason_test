import * as Keychain from 'react-native-keychain';
import AsyncStorage from '@react-native-async-storage/async-storage';

// --- Constants ---
const ACCESS_SERVICE = 'gason_access';
const REFRESH_SERVICE = 'gason_refresh';
const HAS_LAUNCHED_KEY = '@gason_has_launched';

// ==========================================
// 1. ONBOARDING (WELCOME SCREEN) STORAGE
// ==========================================

// Checks if this is the user's very first time opening the app
export const checkFirstLaunch = async (): Promise<boolean> => {
  try {
    const hasLaunched = await AsyncStorage.getItem(HAS_LAUNCHED_KEY);
    return hasLaunched === null; // If null, it is their first time!
  } catch (error) {
    console.error('Error reading launch status:', error);
    return true; // Default to true so they see the Welcome screen on error
  }
};

// Flags the app as launched so they skip the Welcome screen next time
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

// --- Access Token ---
export const setAccessToken = async (token: string) => {
  await Keychain.setGenericPassword('access', token, { service: ACCESS_SERVICE });
};

export const getAccessToken = async () => {
  const creds = await Keychain.getGenericPassword({ service: ACCESS_SERVICE });
  return creds ? creds.password : null;
};

// --- Refresh Token ---
export const setRefreshToken = async (token: string) => {
  await Keychain.setGenericPassword('refresh', token, { service: REFRESH_SERVICE });
};

export const getRefreshToken = async () => {
  const creds = await Keychain.getGenericPassword({ service: REFRESH_SERVICE });
  return creds ? creds.password : null;
};

// --- Clear Tokens ---
export const clearAllTokens = async () => {
  await Keychain.resetGenericPassword({ service: ACCESS_SERVICE });
  await Keychain.resetGenericPassword({ service: REFRESH_SERVICE });
};