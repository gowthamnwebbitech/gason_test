import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  ScrollView,
  Animated,
  Easing,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';

import { Input } from '@/components/Input';
import { ButtonPrimary } from '@/components/ButtonPrimary';
import { colors, spacing, typography, radius } from '@/theme';
import { useAppDispatch, useAppSelector } from '@/store';
import { loginUser } from '../store';

interface FormErrors {
  phone?: string;
  password?: string;
}

export const LoginScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const { isLoading, error: globalError } = useAppSelector(
    (state: any) => state.auth,
  );

  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

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

    const phoneRegex = /^[0-9]{10}$/;
    if (!phone.trim()) {
      newErrors.phone = 'Mobile Number is required.';
      isValid = false;
    } else if (!phoneRegex.test(phone)) {
      newErrors.phone = 'Please enter a valid 10-digit mobile number.';
      isValid = false;
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSignIn = () => {
    if (validateForm()) {
      setApiError(null);

      dispatch(loginUser({ phone: phone.trim(), password }))
        .unwrap()
        .then(() => {
          setIsSuccess(true);
          Toast.show({
            type: 'success',
            text1: 'Login Successful',
            text2: 'Welcome back to Gason!',
          });
        })
        .catch((err: any) => {
          const errMsg = err || 'Incorrect mobile number or password.';
          setApiError(errMsg);
          Toast.show({
            type: 'error',
            text1: 'Login Failed',
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
                <Text style={styles.badgeText}>Welcome Back</Text>
              </View>
              <Text style={styles.title}>Sign in to{'\n'}your account</Text>
              <Text style={styles.subtitle}>Enter your details to access your dashboard.</Text>
            </View>
          </Animated.View>

          {/* 2. ANIMATED FORM */}
          <Animated.View style={{ opacity: formAnim, transform: getTransform(formAnim), flex: 1 }}>
            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Input
                  placeholder="Mobile Number"
                  keyboardType="phone-pad"
                  value={phone}
                  onChangeText={text => {
                    setPhone(text.replace(/[^0-9]/g, ''));
                    clearError('phone');
                  }}
                  editable={!isLoading && !isSuccess}
                  maxLength={10}
                  hasError={!!errors.phone}
                />
                {errors.phone && (
                  <Text style={styles.fieldErrorText}>{errors.phone}</Text>
                )}
              </View>

              <View style={styles.inputGroup}>
                <Input
                  placeholder="Password"
                  isPassword={true}
                  value={password}
                  onChangeText={text => {
                    setPassword(text);
                    clearError('password');
                  }}
                  editable={!isLoading && !isSuccess}
                  hasError={!!errors.password}
                />
                {errors.password && (
                  <Text style={styles.fieldErrorText}>{errors.password}</Text>
                )}
              </View>

              {displayGlobalError ? (
                <View style={styles.errorContainer}>
                  <Icon name="alert-circle" size={16} color={colors.error} style={{ marginRight: spacing.sm }} />
                  <Text style={styles.errorText}>{displayGlobalError}</Text>
                </View>
              ) : null}

              <TouchableOpacity
                onPress={() => navigation.navigate('ForgotPassword')}
                style={styles.forgotBtn}
                disabled={isLoading || isSuccess}
                activeOpacity={0.6}
              >
                <Text style={styles.forgotText}>Forgot password?</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* 3. ANIMATED FOOTER */}
          <Animated.View style={{ opacity: footerAnim, transform: getTransform(footerAnim) }}>
            <View style={styles.bottomSection}>
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
                </Text>
                <TouchableOpacity 
                  onPress={() => !(isLoading || isSuccess) && navigation.navigate('Signup')}
                  disabled={isLoading || isSuccess}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.link, (isLoading || isSuccess) && styles.disabledLink]}>
                    Create one
                  </Text>
                </TouchableOpacity>
              </View>
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
    backgroundColor: '#FFFFFF', // Strict pure white background constraint met
  },
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
  header: { 
    marginBottom: spacing.xxl 
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight, 
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
    color: colors.primaryDark,
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
  },
  form: { 
    gap: spacing.md,
  },
  inputGroup: { 
    marginBottom: spacing.xs 
  },
  fieldErrorText: {
    ...typography.caption, 
    color: colors.error, 
    fontWeight: '500',
    marginTop: spacing.xs,
    marginLeft: spacing.xs,
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
    color: colors.error, 
    fontWeight: '600',
    flex: 1,
  },
  forgotBtn: { 
    alignSelf: 'flex-start', 
    paddingVertical: spacing.sm,
    marginTop: spacing.xs,
  },
  forgotText: { 
    ...typography.bodyLarge, 
    color: colors.textPrimary, 
    fontWeight: '700',
  },
  bottomSection: { 
    gap: spacing.xl, 
    marginTop: spacing.xxl 
  },
  footer: { 
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerText: { 
    ...typography.body, 
    color: colors.textSecondary 
  },
  link: { 
    ...typography.body, 
    fontWeight: '700', 
    color: colors.primary,
  },
  disabledLink: { 
    color: colors.textMuted 
  },
});