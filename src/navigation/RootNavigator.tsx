import React from 'react';
import { AuthStack } from './AuthStack';
import { AppStack } from './AppStack';

export const RootNavigator = () => {
  const isAuthenticated = true; 
  if (!isAuthenticated) {
    return <AuthStack />;
  }  return <AppStack />; 
};