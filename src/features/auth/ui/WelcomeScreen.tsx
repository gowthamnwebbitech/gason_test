// src/features/auth/ui/WelcomeScreen.tsx
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ButtonPrimary } from '@/components/ButtonPrimary';
import { spacing, typography } from '@/theme';
import { images } from '@/assets';
import { useAppDispatch } from '@/store';
import { completeOnboarding } from '../store/login';

export const WelcomeScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();

  const handleGetStarted = async () => {
    // 1. Update Redux & Storage via Thunk
    await dispatch(completeOnboarding());
    // 2. Safely transition
    navigation.replace('Login'); 
  };

  return (
    <View style={[styles.main, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <View style={styles.content}>
        <Text style={styles.title}>
          WELCOME TO GASON{'\n'}INDIA LIMITED
        </Text>
        <Image source={images.logo} style={styles.logo} />
      </View>
      <View style={styles.footer}>
        <ButtonPrimary
          title="Get Started"
          onPress={handleGetStarted}
          style={styles.fullWidth}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: spacing.xl,
  },
  // ... rest of your styles remain identical
  content: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { ...typography.sectionTitle, textAlign: 'center', marginBottom: spacing.xxl, textTransform: 'uppercase' },
  logo: { width: 240, height: 240, resizeMode: 'contain' },
  footer: { paddingBottom: spacing.lg },
  fullWidth: { width: '100%' },
});