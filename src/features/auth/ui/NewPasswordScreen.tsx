import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Input } from '@/components/Input';
import { ButtonPrimary } from '@/components/ButtonPrimary';
import { colors, spacing, typography } from '@/theme';
import { useAppDispatch, useAppSelector } from '@/store';
import { resetPassword } from '../store';

// 1. Define error state shape for field-level validation
interface FormErrors {
  password?: string;
  confirmPassword?: string;
}

export const NewPasswordScreen = ({ navigation, route }: any) => {
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  
  // Pull global loading and API errors from Redux
  const { isLoading, error: globalError } = useAppSelector((state: any) => state.auth);

  // Grab the phone and OTP passed from the previous screens
  const phone = route?.params?.phone || '';
  const otp = route?.params?.otp || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Track field-specific errors and API errors separately
  const [errors, setErrors] = useState<FormErrors>({});
  const [apiError, setApiError] = useState<string | null>(null);

  // Formik-style Validation Engine
  const validateForm = (): boolean => {
    Keyboard.dismiss();
    let isValid = true;
    let newErrors: FormErrors = {};

    // Validate Password
    if (!password) {
      newErrors.password = 'Password is required.';
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long.';
      isValid = false;
    }

    // Validate Confirm Password
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password.';
      isValid = false;
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleConfirm = () => {
    if (validateForm()) {
      setApiError(null); // Clear previous API errors

      // Call Laravel API: /member/reset-password
      dispatch(resetPassword({ phone, otp, password }))
        .unwrap()
        .then(() => {
          navigation.navigate('AuthSuccess'); // Uses the correctly mapped Success Screen
        })
        .catch((err: any) => {
          setApiError(err || 'Failed to reset password. Please try again.');
        });
    }
  };

  // Helper to clear specific field errors instantly as the user types
  const clearError = (field: keyof FormErrors) => {
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    if (apiError) setApiError(null);
  };

  const displayGlobalError = apiError || globalError;

  return (
    <View
      style={[
        styles.main,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
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
              <Text style={styles.title}>New Password</Text>
              <Text style={styles.subtitle}>
                Your password must be different from previous passwords.
              </Text>
            </View>

            <View style={styles.form}>
              
              {/* --- NEW PASSWORD INPUT --- */}
              <View style={styles.inputGroup}>
                <Input
                  placeholder="New Password"
                  isPassword={true}
                  value={password}
                  onChangeText={(text: string) => {
                    setPassword(text);
                    clearError('password');
                  }}
                  editable={!isLoading}
                  hasError={!!errors.password} // Triggers the red border natively
                />
                {errors.password ? (
                  <Text style={styles.fieldErrorText}>{errors.password}</Text>
                ) : (
                  <Text style={styles.validationText}>
                    Must be at least 6 characters long. Include numbers and symbols to make it even safer.
                  </Text>
                )}
              </View>

              {/* --- CONFIRM PASSWORD INPUT --- */}
              <View style={styles.inputGroup}>
                <Input
                  placeholder="Confirm New Password"
                  isPassword={true}
                  value={confirmPassword}
                  onChangeText={(text: string) => {
                    setConfirmPassword(text);
                    clearError('confirmPassword');
                  }}
                  editable={!isLoading}
                  hasError={!!errors.confirmPassword} // Triggers the red border natively
                />
                {errors.confirmPassword && (
                  <Text style={styles.fieldErrorText}>{errors.confirmPassword}</Text>
                )}
              </View>

              {/* --- API / GLOBAL ERROR --- */}
              {displayGlobalError ? (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>• {displayGlobalError}</Text>
                </View>
              ) : null}

            </View>
          </View>

          <View style={styles.footer}>
            <ButtonPrimary
              title={isLoading ? 'Updating...' : 'Confirm'}
              onPress={handleConfirm}
              disabled={isLoading || !password || !confirmPassword}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  main: { 
    flex: 1, 
    backgroundColor: '#FFFFFF' // Strict White Background
  },
  keyboardView: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  header: { marginTop: spacing.xl, marginBottom: spacing.xl },
  title: { ...typography.screenTitle, color: colors.primary, fontSize: 24 },
  subtitle: {
    ...typography.body,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  form: { gap: spacing.md },
  
  // --- FIELD GROUP STYLING ---
  inputGroup: {
    marginBottom: spacing.xs,
  },
  validationText: {
    ...typography.caption,
    color: colors.textMuted,
    lineHeight: 18,
    paddingHorizontal: 4,
    marginTop: 4, 
  },
  fieldErrorText: {
    color: colors.error || '#FF3B30', 
    ...typography.caption,
    fontWeight: '500',
    marginTop: 4,
    marginLeft: 4,
  },

  // --- API ERROR CONTAINER ---
  errorContainer: {
    backgroundColor: '#FFEFEF',
    padding: spacing.sm,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFD6D6',
    marginTop: spacing.xs,
  },
  errorText: { 
    color: colors.error || '#FF3B30', // GUARANTEED RED FALLBACK
    ...typography.caption, 
    fontWeight: '500' 
  },
  
  footer: { marginTop: spacing.xl },
});