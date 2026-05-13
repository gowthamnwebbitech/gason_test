import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { AuthStack } from './AuthStack';
import { AppStack } from './AppStack';
import { useAuth } from './AuthContext'; 
import { colors } from '@/theme';

export const RootNavigator = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // 1. Show a loading spinner while checking Keychain for tokens
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }
  // 2. If not authenticated, show the AuthStack
  if (!isAuthenticated) {
    return <AuthStack />;
  }

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