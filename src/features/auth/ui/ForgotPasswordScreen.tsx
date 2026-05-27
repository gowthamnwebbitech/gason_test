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
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  // --- STAGGERED PREMIUM ANIMATIONS ---
  const headerAnim = useRef(new Animated.Value(0)).current;
  const formAnim = useRef(new Animated.Value(0)).current;
  const footerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Sped up animations (duration: 600, stagger: 100) for a snappier feel
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
          outputRange: [20, 0], // Reduced movement range for tighter feel
        }),
      },
    ];
  };

  const validateForm = (): boolean => {
    Keyboard.dismiss();
    setApiError(null);

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
              paddingTop: Math.max(insets.top + 16, 24), // Tighter top padding
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
                <Text style={styles.badgeText}>Reset Password</Text>
              </View>
              <Text style={styles.title}>Forgot password?</Text>
              <Text style={styles.subtitle}>
                Enter your phone number and we'll send an OTP to reset it.
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
                  hasError={!!phoneError}
                />
                {phoneError && (
                  <Text style={styles.fieldErrorText}>{phoneError}</Text>
                )}
              </View>

              {apiError && (
                <View style={styles.errorContainer}>
                  <Icon name="alert-circle" size={14} color={colors.error || '#FF3B30'} style={{ marginRight: 6 }} />
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
    backgroundColor: '#FFFFFF',
  },
  glowAccentTop: {
    position: 'absolute',
    top: -150,
    right: -100,
    width: 300, // Reduced from 400
    height: 300, 
    borderRadius: radius.full,
  },
  glowAccentBottom: {
    position: 'absolute',
    bottom: -150,
    left: -150,
    width: 300, // Reduced from 450
    height: 300,
    borderRadius: radius.full,
  },
  keyboardView: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20, // Strict, tighter padding
  },
  header: { 
    marginBottom: 24, // Reduced dramatically
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryLight, 
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.xl,
    alignSelf: 'flex-start',
    marginBottom: 12,
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
    color: colors.primaryDark,
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
    lineHeight: 20,
    color: colors.textMuted,
  },
  form: { 
    gap: 12, // Tighter gap
  },
  inputGroup: {
    marginBottom: 4,
  },
  fieldErrorText: {
    ...typography.caption,
    fontSize: 11,
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
    marginBottom: 4,
  },
  errorText: {
    ...typography.caption,
    fontSize: 12, // Scaled down
    color: colors.error || '#FF3B30',
    fontWeight: '600',
    flex: 1,
  },
  footer: { 
    marginTop: 24, // Pulled up significantly
  },
});