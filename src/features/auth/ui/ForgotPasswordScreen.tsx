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
import { forgotPassword } from '../store';

export const ForgotPasswordScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state: any) => state.auth);

  const [phone, setPhone] = useState('');

  // Separated errors: one for the input field, one for the backend response
  const [phoneError, setPhoneError] = useState<string | null>(null);
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

  // Field-level Validation Engine
  const validateForm = (): boolean => {
    Keyboard.dismiss();
    setApiError(null); // Clear previous API errors

    const phoneRegex = /^[0-9]{10}$/;

    if (!phone.trim()) {
      setPhoneError('Mobile Number is required.');
      return false;
    } else if (!phoneRegex.test(phone)) {
      setPhoneError('Please enter a valid 10-digit mobile number.');
      return false;
    }

    setPhoneError(null);
    return true;
  };

  const handleNext = () => {
    if (validateForm()) {
      dispatch(forgotPassword(phone.trim()))
        .unwrap()
        .then(() => {
          Toast.show({
            type: 'success',
            text1: 'OTP Sent',
            text2: 'Please check your phone for the reset code.',
          });
          navigation.navigate('OTP', { type: 'forgot', phone: phone.trim() });
        })
        .catch((err: any) => {
          // Parse API error
          const errMsg =
            err?.message ||
            err?.data?.message ||
            (typeof err === 'string' ? err : 'Failed to send OTP.');

          setApiError(errMsg);

          Toast.show({
            type: 'error',
            text1: 'Request Failed',
            text2: errMsg,
          });
        });
    }
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
                <Text style={styles.badgeText}>Reset Password</Text>
              </View>
              <Text style={styles.title}>Forgot your{'\n'}password?</Text>
              <Text style={styles.subtitle}>
                Don't worry! Enter your phone number so we can send you an OTP to reset it.
              </Text>
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
                  onChangeText={(text: string) => {
                    setPhone(text.replace(/[^0-9]/g, ''));
                    if (phoneError) setPhoneError(null);
                    if (apiError) setApiError(null);
                  }}
                  maxLength={10}
                  editable={!isLoading}
                  hasError={!!phoneError} // Triggers red border on the input
                />
                {/* Field-level error message */}
                {phoneError && (
                  <Text style={styles.fieldErrorText}>{phoneError}</Text>
                )}
              </View>

              {/* Global / API error message */}
              {apiError && (
                <View style={styles.errorContainer}>
                  <Icon name="alert-circle" size={16} color={colors.error || '#FF3B30'} style={{ marginRight: spacing.sm }} />
                  <Text style={styles.errorText}>{apiError}</Text>
                </View>
              )}
            </View>
          </Animated.View>

          {/* 3. ANIMATED FOOTER */}
          <Animated.View style={{ opacity: footerAnim, transform: getTransform(footerAnim) }}>
            <View style={styles.footer}>
              <ButtonPrimary
                title={isLoading ? 'Sending OTP...' : 'Next'}
                onPress={handleNext}
                disabled={isLoading}
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
  
  // --- FORM STYLING ---
  form: { gap: spacing.md },

  // --- ERROR STYLING ---
  inputGroup: {
    marginBottom: spacing.xs,
  },
  fieldErrorText: {
    ...typography.caption,
    color: colors.error || '#FF3B30', // Spread typography first, color last
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
    marginBottom: spacing.xs,
  },
  errorText: {
    ...typography.caption,
    color: colors.error || '#FF3B30',
    fontWeight: '600',
    flex: 1,
  },

  // --- FOOTER STYLING ---
  footer: { 
    marginTop: spacing.xl 
  },
});