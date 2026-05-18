// src/navigation/RootNavigator.tsx
import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { AuthStack } from './AuthStack';
import { AppStack } from './AppStack';
import { useAppSelector, useAppDispatch } from '@/store';
import { initializeApp } from '@/features/auth/store';
import { colors } from '@/theme';

export const RootNavigator = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, isAppReady, isFirstLaunch } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(initializeApp());
  }, [dispatch]);

  // 2. Show loading while checking storage
  if (!isAppReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // 3. Not authenticated? Show AuthStack and tell it if it's the first launch
  if (!isAuthenticated) {
    return <AuthStack isFirstLaunch={isFirstLaunch} />;
  }

  // 4. Authenticated? Automatically show the Dashboard (Home)
  return <AppStack />; 
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
});