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
import { signupUser } from '../store';

interface FormErrors {
  name?: string;
  phone?: string;
  email?: string;
  password?: string;
  terms?: string;
}

export const SignupScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const { isLoading, error: globalError } = useAppSelector(
    (state: any) => state.auth,
  );

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAccepted, setIsAccepted] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  // --- STAGGERED PREMIUM ANIMATIONS ---
  const headerAnim = useRef(new Animated.Value(0)).current;
  const formAnim = useRef(new Animated.Value(0)).current;
  const footerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Reduced stagger delay for a snappier, compact feel
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
          outputRange: [20, 0], // Reduced movement range from 40 to 20
        }),
      },
    ];
  };

  const validateForm = (): boolean => {
    Keyboard.dismiss();
    let isValid = true;
    let newErrors: FormErrors = {};

    if (!name.trim() || name.trim().length < 3) {
      newErrors.name = 'Name must be at least 3 characters.';
      isValid = false;
    }
    if (!phone.trim() || !/^[0-9]{10}$/.test(phone)) {
      newErrors.phone = 'Valid 10-digit mobile number required.';
      isValid = false;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Valid email required.';
      isValid = false;
    }
    if (!password || password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
      isValid = false;
    }
    if (!isAccepted) {
      newErrors.terms = 'You must accept the Terms & Privacy.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSignup = () => {
    if (validateForm()) {
      dispatch(
        signupUser({
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim(),
          password,
        }),
      )
        .unwrap()
        .then(user => {
          Toast.show({
            type: 'success',
            text1: 'Account Created',
            text2: 'Please verify your phone number to continue.',
          });
          navigation.navigate('OTP', {
            type: 'signup',
            phone: phone.trim(),
            userId: user.id,
          });
        })
        .catch((err: any) => {
          Toast.show({
            type: 'error',
            text1: 'Registration Failed',
            text2: err || 'Something went wrong. Please try again.',
          });
        });
    }
  };

  const clearError = (field: keyof FormErrors) => {
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

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
              paddingTop: Math.max(insets.top + 10, 20), 
              paddingBottom: Math.max(insets.bottom + 10, 20) 
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
                <Text style={styles.badgeText}>New Here?</Text>
              </View>
              <Text style={styles.title}>Create account</Text>
              <Text style={styles.subtitle}>Fill details to get started.</Text>
            </View>
          </Animated.View>

          {/* 2. ANIMATED FORM */}
          <Animated.View style={{ opacity: formAnim, transform: getTransform(formAnim), flex: 1 }}>
            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Input
                  placeholder="Full Name"
                  value={name}
                  onChangeText={t => {
                    setName(t);
                    clearError('name');
                  }}
                  editable={!isLoading}
                  autoCapitalize="words"
                  hasError={!!errors.name}
                />
                {errors.name && (
                  <Text style={styles.fieldErrorText}>{errors.name}</Text>
                )}
              </View>

              <View style={styles.inputGroup}>
                <Input
                  placeholder="Mobile Number"
                  keyboardType="phone-pad"
                  value={phone}
                  onChangeText={t => {
                    setPhone(t.replace(/[^0-9]/g, ''));
                    clearError('phone');
                  }}
                  editable={!isLoading}
                  maxLength={10}
                  hasError={!!errors.phone}
                />
                {errors.phone && (
                  <Text style={styles.fieldErrorText}>{errors.phone}</Text>
                )}
              </View>

              <View style={styles.inputGroup}>
                <Input
                  placeholder="Email Address"
                  keyboardType="email-address"
                  value={email}
                  onChangeText={t => {
                    setEmail(t);
                    clearError('email');
                  }}
                  editable={!isLoading}
                  autoCapitalize="none"
                  hasError={!!errors.email}
                />
                {errors.email && (
                  <Text style={styles.fieldErrorText}>{errors.email}</Text>
                )}
              </View>

              <View style={styles.inputGroup}>
                <Input
                  placeholder="Password"
                  isPassword={true}
                  value={password}
                  onChangeText={t => {
                    setPassword(t);
                    clearError('password');
                  }}
                  editable={!isLoading}
                  hasError={!!errors.password}
                />
                {errors.password && (
                  <Text style={styles.fieldErrorText}>{errors.password}</Text>
                )}
              </View>

              {globalError ? (
                <View style={styles.globalErrorContainer}>
                  <Icon name="alert-circle" size={14} color={colors.error} style={{ marginRight: 6 }} />
                  <Text style={styles.globalErrorText}>{globalError}</Text>
                </View>
              ) : null}

              <View style={styles.inputGroup}>
                <TouchableOpacity
                  style={styles.termsRow}
                  onPress={() => {
                    if (!isLoading) {
                      setIsAccepted(!isAccepted);
                      clearError('terms');
                    }
                  }}
                  activeOpacity={0.7}
                >
                  <View
                    style={[
                      styles.checkbox,
                      isAccepted && styles.checkboxActive,
                      errors.terms ? styles.checkboxError : null,
                    ]}
                  >
                    {isAccepted && (
                      <Icon name="check" size={10} color={colors.white} />
                    )}
                  </View>
                  <Text style={styles.termsText}>
                    I accept the{' '}
                    <Text style={styles.termsBold}>Terms & Privacy</Text>
                  </Text>
                </TouchableOpacity>
                {errors.terms && (
                  <Text style={styles.fieldErrorText}>{errors.terms}</Text>
                )}
              </View>
            </View>
          </Animated.View>

          {/* 3. ANIMATED FOOTER */}
          <Animated.View style={{ opacity: footerAnim, transform: getTransform(footerAnim) }}>
            <View style={styles.bottomSection}>
              <ButtonPrimary
                title={isLoading ? 'Creating Account...' : 'Sign Up'}
                onPress={handleSignup}
                disabled={isLoading}
              />
              <View style={styles.footer}>
                <Text style={styles.footerText}>
                  Already have an account?{' '}
                </Text>
                <TouchableOpacity
                  onPress={() => !isLoading && navigation.navigate('Login')}
                  disabled={isLoading}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.link, isLoading && styles.disabledLink]}>
                    Sign In
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
    backgroundColor: '#FFFFFF',
  },
  glowAccentTop: {
    position: 'absolute',
    top: -150,
    right: -100,
    width: 300,
    height: 300,
    borderRadius: radius.full,
  },
  glowAccentBottom: {
    position: 'absolute',
    bottom: -150,
    left: -150,
    width: 300,
    height: 300,
    borderRadius: radius.full,
  },
  keyboardView: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20, // Tightened from spacing.lg
  },
  header: { 
    marginBottom: 16, // Reduced from spacing.xl
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight, 
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.xl,
    alignSelf: 'flex-start',
    marginBottom: 8, // Tighter margin
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
    fontSize: 10, // Made slightly smaller
    color: colors.primaryDark,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  title: { 
    ...typography.screenTitle,
    fontSize: 26, // Reduced from 36
    lineHeight: 32, // Reduced from 44
    color: colors.textPrimary,
    letterSpacing: -0.5,
    marginBottom: 2, // Removed spacing.xs
  },
  subtitle: {
    ...typography.bodyLarge,
    fontSize: 14,
    color: colors.textMuted,
  },
  form: { 
    gap: 8, // Reduced dramatically from spacing.md
  },
  inputGroup: { 
    marginBottom: 4, 
  },
  fieldErrorText: {
    ...typography.caption,
    fontSize: 11, // Compressed error text
    color: colors.error,
    fontWeight: '500',
    marginTop: 2,
    marginLeft: 4,
  },
  globalErrorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5F5',
    padding: 8, // Smaller padding
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#FFE1E1',
    marginTop: 4,
    marginBottom: 4,
  },
  globalErrorText: {
    ...typography.caption,
    fontSize: 12,
    color: colors.error,
    fontWeight: '600',
    flex: 1,
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    marginTop: 4,
  },
  checkbox: {
    width: 18, // Reduced from 22
    height: 18, // Reduced from 22
    borderRadius: radius.sm,
    borderWidth: 1.5,
    borderColor: colors.primary,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  checkboxActive: { 
    backgroundColor: colors.primary 
  },
  checkboxError: {
    borderColor: colors.error,
    backgroundColor: '#FFF5F5',
  },
  termsText: { 
    ...typography.caption, 
    color: colors.textSecondary,
    fontSize: 12, // Reduced from 14
  },
  termsBold: { 
    fontWeight: '700', 
    color: colors.textPrimary 
  },
  bottomSection: { 
    gap: 12, // Reduced from spacing.xl
    marginTop: 16, // Reduced from spacing.xl
  },
  footer: { 
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerText: { 
    ...typography.body, 
    fontSize: 13, // Smaller footer text
    color: colors.textSecondary 
  },
  link: { 
    ...typography.body, 
    fontSize: 13,
    fontWeight: '700', 
    color: colors.primary,
  },
  disabledLink: { 
    color: colors.textMuted 
  },
});