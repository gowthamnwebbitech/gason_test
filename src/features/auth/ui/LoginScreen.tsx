import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Input } from '@/components/Input';
import { ButtonPrimary } from '@/components/ButtonPrimary';
import { colors, spacing, typography } from '@/theme';
import { useAppDispatch, useAppSelector } from '@/store';
import { loginUser } from '../store';

export const LoginScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();

  const { isLoading, error } = useAppSelector(state => state.auth);

  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (localError) setLocalError(null);
  }, [phone, password]);

  const validateForm = () => {
    if (!phone.trim() || !password.trim()) {
      setLocalError('Please enter both phone number and password.');
      return false;
    }
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      setLocalError('Please enter a valid 10-digit mobile number.');
      return false;
    }
    return true;
  };

  const handleSignIn = () => {
    Keyboard.dismiss();
    if (validateForm()) {
      dispatch(loginUser({ phone: phone.trim(), password }));
    }
  };

  const displayError = localError || error;

  return (
    <View style={[styles.main, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.keyboardView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View>
            <View style={styles.header}>
              <Text style={styles.welcome}>Welcome back!</Text>
              <Text style={styles.title}>Sign In</Text>
            </View>

            <View style={styles.form}>
              <Input
                placeholder="Mobile Number"
                keyboardType="phone-pad"
                autoCapitalize="none"
                value={phone}
                onChangeText={setPhone}
                editable={!isLoading}
                maxLength={10}
              />
              <Input
                placeholder="Password"
                isPassword={true}
                value={password}
                onChangeText={setPassword}
                editable={!isLoading}
              />

              {displayError && (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>• {displayError}</Text>
                </View>
              )}

              <TouchableOpacity 
                onPress={() => navigation.navigate('ForgotPassword')} 
                style={styles.forgotBtn} 
                disabled={isLoading}
              >
                <Text style={styles.forgotText}>Forget Password?</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.bottomSection}>
            <ButtonPrimary 
              title={isLoading ? 'Signing in...' : 'Sign In'} 
              onPress={handleSignIn} 
              disabled={isLoading} 
            />

            <View style={styles.footer}>
              <Text style={styles.footerText}>
                Don’t have an account?{' '}
                <Text 
                  style={[styles.link, isLoading && styles.disabledLink]} 
                  onPress={() => !isLoading && navigation.navigate('Signup')}
                >
                  Sign Up
                </Text>
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  main: { flex: 1, backgroundColor: '#FFFFFF' },
  keyboardView: { flex: 1 },
  scrollContent: { 
    flexGrow: 1, 
    paddingHorizontal: spacing.lg, 
    justifyContent: 'space-between',
    paddingBottom: spacing.lg 
  },
  header: { marginTop: spacing.xl, marginBottom: spacing.xl },
  welcome: { ...typography.sectionTitle, color: colors.primary },
  title: { ...typography.screenTitle },
  form: { gap: spacing.md },
  errorContainer: { backgroundColor: '#FFEFEF', padding: spacing.sm, borderRadius: 8, borderWidth: 1, borderColor: '#FFD6D6' },
  errorText: { color: colors.error, ...typography.caption, fontWeight: '500' },
  forgotBtn: { alignSelf: 'flex-end' },
  forgotText: { ...typography.body, color: colors.textPrimary },
  bottomSection: { gap: spacing.xl, marginTop: spacing.xxl },
  footer: { alignItems: 'center' },
  footerText: { ...typography.body, color: colors.textSecondary },
  link: { ...typography.link, fontWeight: 'bold', color: colors.black },
  disabledLink: { color: colors.textMuted },
});