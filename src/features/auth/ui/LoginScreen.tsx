// src/features/auth/ui/LoginScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

import { Input } from '@/components/Input';
import { ButtonPrimary } from '@/components/ButtonPrimary';
import { ButtonOutline } from '@/components/ButtonOutline';
import { colors, spacing, typography } from '@/theme';
import { useAppDispatch, useAppSelector } from '@/store';
// Import googleLoginUser here:
import { loginUser, googleLoginUser } from '../store/login/authThunks';

export const LoginScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();

  const { isLoading, error } = useAppSelector(state => state.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // 1. Initialize Google Sign-In
  useEffect(() => {
    GoogleSignin.configure({
      // IMPORTANT: Replace this string with your actual Web Client ID from google-services.json
      webClientId: 'YOUR_WEB_CLIENT_ID_HERE', 
    });
  }, []);

  const handleSignIn = () => {
    if (email && password) {
      dispatch(loginUser({ email, password }));
    }
  };

  // 2. Dispatch Google Login
  const handleGoogleSignIn = () => {
    dispatch(googleLoginUser());
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View
        style={[
          styles.main,
          { paddingTop: insets.top, paddingBottom: insets.bottom },
        ]}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.container}
        >
          <View style={styles.header}>
            <Text style={styles.welcome}>Welcome back!</Text>
            <Text style={styles.title}>Sign In</Text>
          </View>

          <View style={styles.form}>
            <Input
              placeholder="Email"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
            <Input
              placeholder="Password"
              isPassword={true}
              value={password}
              onChangeText={setPassword}
            />

            {/* Display Redux Error message if login fails */}
            {error && <Text style={styles.errorText}>{error}</Text>}

            <TouchableOpacity
              onPress={() => navigation.navigate('ForgotPassword')}
              style={styles.forgotBtn}
            >
              <Text style={styles.forgotText}>Forget Password?</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.actions}>
            <ButtonPrimary
              title={isLoading ? 'Signing in...' : 'Sign In'}
              onPress={handleSignIn}
              disabled={isLoading}
            />
            <View style={styles.dividerRow}>
              <View style={styles.line} />
              <Text style={styles.orText}>OR</Text>
              <View style={styles.line} />
            </View>
            
            {/* 3. Wire up the Google Button */}
            <ButtonOutline 
              title="Continue with Google" 
              icon="google" 
              onPress={handleGoogleSignIn}
              disabled={isLoading}
            />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Don’t have an account ?{' '}
              <Text
                style={styles.link}
                onPress={() => navigation.navigate('Signup')}
              >
                Sign Up
              </Text>
            </Text>
          </View>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  main: { flex: 1, backgroundColor: '#FFFFFF' }, // Ensuring white background constraint
  container: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    justifyContent: 'space-between',
  },
  header: { marginTop: spacing.xl },
  welcome: { ...typography.sectionTitle, color: colors.primary },
  title: { ...typography.screenTitle },
  form: { gap: spacing.xs },
  errorText: {
    color: colors.error,
    ...typography.caption,
    marginTop: spacing.xs,
  },
  forgotBtn: { alignSelf: 'flex-end', marginTop: spacing.xs },
  forgotText: { ...typography.body, color: colors.textPrimary },
  actions: { gap: spacing.md },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.sm,
  },
  line: { flex: 1, height: 1, backgroundColor: colors.border },
  orText: {
    marginHorizontal: spacing.md,
    color: colors.textMuted,
    ...typography.caption,
  },
  footer: { marginBottom: spacing.lg },
  footerText: {
    ...typography.body,
    textAlign: 'center',
    color: colors.textSecondary,
  },
  link: { ...typography.link, fontWeight: 'bold', color: colors.black },
});