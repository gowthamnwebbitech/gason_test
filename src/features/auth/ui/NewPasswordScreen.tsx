import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
  Animated,
  Easing,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';

import { ButtonPrimary } from '@/components/ButtonPrimary';
import { Input } from '@/components/Input';
import { colors, spacing, typography, radius } from '@/theme';
import { useAppDispatch, useAppSelector } from '@/store';
import { resetPassword } from '../store';

interface FormErrors {
  password?: string;
  confirmPassword?: string;
}

export const NewPasswordScreen = ({ navigation, route }: any) => {
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const { isLoading, error: globalError } = useAppSelector(
    (state: any) => state.auth,
  );

  const phone = route?.params?.phone || '';
  const otp = route?.params?.otp || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [apiError, setApiError] = useState<string | null>(null);

  // --- STAGGERED PREMIUM ANIMATIONS ---
  const headerAnim = useRef(new Animated.Value(0)).current;
  const formAnim = useRef(new Animated.Value(0)).current;
  const footerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Sped up animations (duration: 600, stagger: 100) for a snappier, compact feel
    Animated.stagger(100, [
      Animated.timing(headerAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.timing(formAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.timing(footerAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
    ]).start();
  }, [headerAnim, formAnim, footerAnim]);

  const getTransform = (anim: Animated.Value) => {
    return [
      {
        translateY: anim.interpolate({
          inputRange: [0, 1],
          outputRange: [20, 0],
        }),
      },
    ];
  };

  const validateForm = (): boolean => {
    Keyboard.dismiss();
    let isValid = true;
    let newErrors: FormErrors = {};

    if (!password || password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
      isValid = false;
    }
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
      setApiError(null);

      dispatch(resetPassword({ phone, otp, password }))
        .unwrap()
        .then(() => {
          Toast.show({
            type: 'success',
            text1: 'Password Updated',
            text2: 'Your password has been changed successfully.',
          });
          navigation.navigate('AuthSuccess');
        })
        .catch((err: any) => {
          const errMsg = err || 'Failed to reset password. Please try again.';
          setApiError(errMsg);
          Toast.show({
            type: 'error',
            text1: 'Reset Failed',
            text2: errMsg,
          });
        });
    }
  };

  const clearError = (field: keyof FormErrors) => {
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
    if (apiError) setApiError(null);
  };

  const displayGlobalError = apiError || globalError;

  return (
    <View style={styles.main}>
      {/* ULTRA-SOFT BACKGROUND GRADIENT ORBS */}
      <LinearGradient
        colors={[colors.primary + '15', 'rgba(255,255,255,0)']}
        style={styles.glowAccentTop}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      <LinearGradient
        colors={[colors.primary + '0A', 'rgba(255,255,255,0)']}
        style={styles.glowAccentBottom}
        start={{ x: 1, y: 1 }}
        end={{ x: 0, y: 0 }}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { 
              paddingTop: Math.max(insets.top + 16, 24), 
              paddingBottom: Math.max(insets.bottom + 16, 24) 
            }
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* 1. ANIMATED HEADER */}
          <Animated.View style={{ opacity: headerAnim, transform: getTransform(headerAnim) }}>
            <View style={styles.header}>
              <View style={styles.badgeContainer}>
                <View style={styles.badgeDot} />
                <Text style={styles.badgeText}>Secure Account</Text>
              </View>
              <Text style={styles.title}>Create new password</Text>
              <Text style={styles.subtitle}>
                Your new password must be different from previous passwords to ensure security.
              </Text>
            </View>
          </Animated.View>

          {/* 2. ANIMATED FORM */}
          <Animated.View style={{ opacity: formAnim, transform: getTransform(formAnim), flex: 1 }}>
            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Input
                  placeholder="New Password"
                  isPassword={true}
                  value={password}
                  onChangeText={t => {
                    setPassword(t);
                    clearError('password');
                  }}
                  editable={!isLoading}
                  hasError={!!errors.password}
                />
                {errors.password ? (
                  <Text style={styles.fieldErrorText}>{errors.password}</Text>
                ) : (
                  <Text style={styles.validationText}>
                    Must be at least 6 characters long.
                  </Text>
                )}
              </View>

              <View style={styles.inputGroup}>
                <Input
                  placeholder="Confirm New Password"
                  isPassword={true}
                  value={confirmPassword}
                  onChangeText={t => {
                    setConfirmPassword(t);
                    clearError('confirmPassword');
                  }}
                  editable={!isLoading}
                  hasError={!!errors.confirmPassword}
                />
                {errors.confirmPassword && (
                  <Text style={styles.fieldErrorText}>
                    {errors.confirmPassword}
                  </Text>
                )}
              </View>

              {displayGlobalError ? (
                <View style={styles.errorContainer}>
                  <Icon name="alert-circle" size={14} color={colors.error || '#FF3B30'} style={{ marginRight: 6 }} />
                  <Text style={styles.errorText}>{displayGlobalError}</Text>
                </View>
              ) : null}
            </View>
          </Animated.View>

          {/* 3. ANIMATED FOOTER */}
          <Animated.View style={{ opacity: footerAnim, transform: getTransform(footerAnim) }}>
            <View style={styles.footer}>
              <ButtonPrimary
                title={isLoading ? 'Updating...' : 'Confirm Password'}
                onPress={handleConfirm}
                disabled={isLoading || !password || !confirmPassword}
              />
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  main: { 
    flex: 1, 
    backgroundColor: '#FFFFFF',
  },
  glowAccentTop: {
    position: 'absolute',
    top: -150,
    right: -100,
    width: 300, // Reduced
    height: 300, 
    borderRadius: radius.full,
  },
  glowAccentBottom: {
    position: 'absolute',
    bottom: -150,
    left: -150,
    width: 300, // Reduced
    height: 300,
    borderRadius: radius.full,
  },
  keyboardView: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20, // Tightened padding
  },
  header: { 
    marginBottom: 24, // Reduced from spacing.xxl
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight || '#F9FAFB', 
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.xl,
    alignSelf: 'flex-start',
    marginBottom: 12, // Tighter margin
  },
  badgeDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: colors.primary,
    marginRight: 6,
  },
  badgeText: {
    ...typography.caption,
    fontSize: 10, // Scaled down
    color: colors.primaryDark || colors.textSecondary,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  title: { 
    ...typography.screenTitle,
    fontSize: 28, // Reduced from 36
    lineHeight: 34, // Reduced from 44
    color: colors.textPrimary,
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  subtitle: {
    ...typography.bodyLarge,
    fontSize: 14, // Scaled down
    color: colors.textMuted,
    lineHeight: 20,
  },
  form: { 
    gap: 12, // Reduced from spacing.md
  },
  inputGroup: { 
    marginBottom: 4, 
  },
  validationText: {
    ...typography.caption,
    fontSize: 11, // Compressed helper text
    color: colors.textMuted,
    lineHeight: 16,
    paddingHorizontal: 4,
    marginTop: 4,
  },
  fieldErrorText: {
    ...typography.caption, 
    fontSize: 11, // Compressed error text
    color: colors.error || '#FF3B30', 
    fontWeight: '500',
    marginTop: 4,
    marginLeft: 4,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5F5',
    padding: 10, // Tighter padding
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#FFE1E1',
    marginTop: 4,
  },
  errorText: {
    ...typography.caption, 
    fontSize: 12, // Scaled down
    color: colors.error || '#FF3B30', 
    fontWeight: '600',
    flex: 1,
  },
  footer: { 
    marginTop: 24, // Pulled up significantly from spacing.xxl
  },
});