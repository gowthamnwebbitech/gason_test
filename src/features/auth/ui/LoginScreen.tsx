import React, { useState } from 'react';
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

// 1. Define specific errors for field-level validation
interface FormErrors {
  phone?: string;
  password?: string;
}

export const LoginScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();

  // Pull global loading and API errors from Redux
  const { isLoading, error: globalError } = useAppSelector((state: any) => state.auth);

  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  
  // Track field-specific errors, API errors, and local success state
  const [errors, setErrors] = useState<FormErrors>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // Field-level Validation Engine
  const validateForm = (): boolean => {
    Keyboard.dismiss();
    let isValid = true;
    let newErrors: FormErrors = {};

    // Validate Phone
    const phoneRegex = /^[0-9]{10}$/;
    if (!phone.trim()) {
      newErrors.phone = 'Mobile Number is required.';
      isValid = false;
    } else if (!phoneRegex.test(phone)) {
      newErrors.phone = 'Please enter a valid 10-digit mobile number.';
      isValid = false;
    }

    // Validate Password
    if (!password.trim()) {
      newErrors.password = 'Password is required.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSignIn = () => {
    if (validateForm()) {
      setApiError(null); // Clear old API errors before trying again

      dispatch(loginUser({ phone: phone.trim(), password }))
        .unwrap()
        .then((user) => {
          setIsSuccess(true);
        })
        .catch((err: any) => {
          setApiError(err || 'Incorrect mobile number or password.');
        });
    }
  };

  // Helper to clear a specific field's error instantly when the user types
  const clearError = (field: keyof FormErrors) => {
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    if (apiError) setApiError(null);
  };

  // Combine API errors and Global Redux errors for display
  const displayGlobalError = apiError || globalError;

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
          bounces={false}
        >
          <View>
            <View style={styles.header}>
              <Text style={styles.welcome}>Welcome back!</Text>
              <Text style={styles.title}>Sign In</Text>
            </View>

            <View style={styles.form}>
              
              {/* --- PHONE INPUT --- */}
              <View style={styles.inputGroup}>
                <Input
                  placeholder="Mobile Number"
                  keyboardType="phone-pad"
                  autoCapitalize="none"
                  value={phone}
                  onChangeText={(text: string) => {
                    setPhone(text.replace(/[^0-9]/g, '')); // Strictly numbers
                    clearError('phone');
                  }}
                  editable={!isLoading && !isSuccess}
                  maxLength={10}
                  hasError={!!errors.phone} // Triggers the red border natively
                />
                {errors.phone && (
                  <View style={styles.errorTextWrapper}>
                    <Text style={styles.fieldErrorText}>{errors.phone}</Text>
                  </View>
                )}
              </View>

              {/* --- PASSWORD INPUT --- */}
              <View style={styles.inputGroup}>
                <Input
                  placeholder="Password"
                  isPassword={true}
                  value={password}
                  onChangeText={(text: string) => {
                    setPassword(text);
                    clearError('password');
                  }}
                  editable={!isLoading && !isSuccess}
                  hasError={!!errors.password} // Triggers the red border natively
                />
                {errors.password && (
                  <View style={styles.errorTextWrapper}>
                    <Text style={styles.fieldErrorText}>{errors.password}</Text>
                  </View>
                )}
              </View>

              {/* --- GLOBAL / API ERROR CONTAINER --- */}
              {displayGlobalError ? (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>• {displayGlobalError}</Text>
                </View>
              ) : null}

              <TouchableOpacity 
                onPress={() => navigation.navigate('ForgotPassword')} 
                style={styles.forgotBtn} 
                disabled={isLoading || isSuccess}
                activeOpacity={0.7}
              >
                <Text style={styles.forgotText}>Forget Password?</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.bottomSection}>
            {/* 3. DYNAMIC BUTTON TEXT FOR SUCCESS */}
            <ButtonPrimary 
              title={
                isSuccess 
                  ? 'Welcome Back! ✓' 
                  : isLoading 
                    ? 'Signing in...' 
                    : 'Sign In'
              } 
              onPress={handleSignIn} 
              disabled={isLoading || isSuccess} 
            />

            <View style={styles.footer}>
              <Text style={styles.footerText}>
                Don’t have an account?{' '}
                <Text 
                  style={[styles.link, (isLoading || isSuccess) && styles.disabledLink]} 
                  onPress={() => !(isLoading || isSuccess) && navigation.navigate('Signup')}
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
  main: { 
    flex: 1, 
    backgroundColor: '#FFFFFF' // Strict white background maintained
  },
  keyboardView: { 
    flex: 1 
  },
  scrollContent: { 
    flexGrow: 1, 
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg, 
    paddingBottom: spacing.xxl, 
  },
  header: { 
    marginTop: spacing.xl, 
    marginBottom: spacing.xl 
  },
  welcome: { 
    ...typography.sectionTitle, 
    color: colors.primary 
  },
  title: { 
    ...typography.screenTitle 
  },
  form: { 
    gap: spacing.md 
  },

  // --- FIELD ERROR STYLING ---
  inputGroup: {
    marginBottom: spacing.xs,
  },
  errorTextWrapper: {
    marginTop: 4,
    marginLeft: 4,
  },
  fieldErrorText: {
    color: colors.error || '#FF3B30', // Guaranteed Red Fallback
    ...typography.caption,
    fontWeight: '500',
  },

  // --- GLOBAL ERROR STYLING ---
  errorContainer: { 
    backgroundColor: '#FFEFEF', 
    padding: spacing.sm, 
    borderRadius: 8, 
    borderWidth: 1, 
    borderColor: '#FFD6D6',
    marginTop: spacing.xs,
  },
  errorText: { 
    color: colors.error || '#FF3B30', // Guaranteed Red Fallback
    ...typography.caption, 
    fontWeight: '500' 
  },

  // --- INTERACTIVE ELEMENTS ---
  forgotBtn: { 
    alignSelf: 'flex-end',
    paddingVertical: spacing.sm,
  },
  forgotText: { 
    ...typography.body, 
    color: colors.textPrimary 
  },
  bottomSection: { 
    gap: spacing.xl,
    marginTop: spacing.xl,
  },
  footer: { 
    alignItems: 'center' 
  },
  footerText: { 
    ...typography.body, 
    color: colors.textSecondary 
  },
  link: { 
    ...typography.link, 
    fontWeight: 'bold', 
    color: colors.black 
  },
  disabledLink: { 
    color: colors.textMuted 
  },
});