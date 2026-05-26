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
    Animated.stagger(150, [
      Animated.timing(headerAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.timing(formAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.timing(footerAnim, {
        toValue: 1,
        duration: 800,
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
          outputRange: [40, 0],
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
            { paddingTop: insets.top + spacing.xl, paddingBottom: Math.max(insets.bottom, spacing.xxl) }
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
              <Text style={styles.title}>Create new{'\n'}password</Text>
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
                  <Icon name="alert-circle" size={16} color={colors.error || '#FF3B30'} style={{ marginRight: spacing.sm }} />
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
    backgroundColor: '#FFFFFF', // STRICT WHITE BACKGROUND MAINTAINED
  },
  
  // --- DECORATIVE BACKGROUND ELEMENTS ---
  glowAccentTop: {
    position: 'absolute',
    top: -150,
    right: -100,
    width: 400,
    height: 400,
    borderRadius: radius.full,
  },
  glowAccentBottom: {
    position: 'absolute',
    bottom: -200,
    left: -150,
    width: 450,
    height: 450,
    borderRadius: radius.full,
  },

  keyboardView: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: spacing.lg,
  },
  
  // --- MODERN HEADER STYLING ---
  header: { 
    marginBottom: spacing.xxl 
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight || '#F9FAFB', 
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.xl,
    alignSelf: 'flex-start',
    marginBottom: spacing.md,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
    marginRight: spacing.xs,
  },
  badgeText: {
    ...typography.caption,
    color: colors.primaryDark || colors.textSecondary,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  title: { 
    ...typography.screenTitle,
    fontSize: 36, 
    lineHeight: 44,
    color: colors.textPrimary,
    letterSpacing: -0.5,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.bodyLarge,
    color: colors.textMuted,
    lineHeight: 24,
  },
  
  // --- FORM STYLING ---
  form: { 
    gap: spacing.md 
  },
  inputGroup: { 
    marginBottom: spacing.xs 
  },
  
  // --- HELPER & ERROR STYLING ---
  validationText: {
    ...typography.caption,
    color: colors.textMuted,
    lineHeight: 18,
    paddingHorizontal: 4,
    marginTop: 4,
  },
  fieldErrorText: {
    ...typography.caption, // Spread typography first
    color: colors.error || '#FF3B30', // Apply priority color
    fontWeight: '500',
    marginTop: 6,
    marginLeft: 4,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5F5',
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#FFE1E1',
    marginTop: spacing.xs,
  },
  errorText: {
    ...typography.caption, 
    color: colors.error || '#FF3B30', 
    fontWeight: '600',
    flex: 1,
  },
  
  // --- FOOTER STYLING ---
  footer: { 
    marginTop: spacing.xxl 
  },
});