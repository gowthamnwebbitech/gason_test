import React, { useRef, useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView,
  Keyboard,
  TouchableOpacity,
  Animated,
  Easing
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';

import { ButtonPrimary } from '@/components/ButtonPrimary';
import { colors, spacing, typography, radius } from '@/theme';
import { useAppDispatch, useAppSelector } from '@/store';
import { verifySignupOtp, forgotPassword } from '../store';

export const OTPScreen = ({ navigation, route }: any) => {
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  
  const { isLoading } = useAppSelector((state: any) => state.auth);

  const type = route?.params?.type || 'signup'; 
  const phone = route?.params?.phone || '';
  const userId = route?.params?.userId || '';

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [localError, setLocalError] = useState<string | null>(null);
  
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  
  const inputs = useRef<Array<TextInput | null>>([]);
  const isOtpComplete = otp.every(val => val !== '');

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

  useEffect(() => {
    const timeout = setTimeout(() => {
      inputs.current[0]?.focus();
    }, 100);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `0${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleVerify = useCallback(() => {
    if (isLoading) return;
    
    const otpString = otp.join('');

    if (otpString.length !== 6 || !/^\d{6}$/.test(otpString)) {
      setLocalError('Please enter all 6 digits to verify.');
      return;
    }

    Keyboard.dismiss();

    if (type === 'signup') {
      dispatch(verifySignupOtp({ user_id: userId, otp: otpString }))
        .unwrap()
        .then(() => {
          Toast.show({
            type: 'success',
            text1: 'Verification Successful',
            text2: 'Your account has been verified. You can now log in.',
            position: 'top',
          });
          
          navigation.navigate('Login'); 
        })
        .catch((err: any) => {
          const errorMessage = err?.message || err?.data?.message || (typeof err === 'string' ? err : 'The verification code is incorrect. Please try again.');
          
          setLocalError(errorMessage);
          
          Toast.show({
            type: 'error',
            text1: 'Verification Failed',
            text2: errorMessage,
            position: 'top',
          });
          
          setOtp(['', '', '', '', '', '']);
          inputs.current[0]?.focus();
        });
    } else if (type === 'forgot') {
      navigation.navigate('NewPassword', { phone, otp: otpString });
    }
  }, [otp, isLoading, type, dispatch, userId, navigation, phone]);

  useEffect(() => {
    if (isOtpComplete && !isLoading) {
      handleVerify();
    }
  }, [isOtpComplete, isLoading, handleVerify]);

  const handleResend = () => {
    if (!canResend) return;
    
    setTimer(60);
    setCanResend(false);
    setLocalError(null);
    setOtp(['', '', '', '', '', '']); 
    inputs.current[0]?.focus(); 

    if (type === 'forgot') {
      dispatch(forgotPassword(phone))
        .unwrap()
        .then(() => {
          Toast.show({
            type: 'success',
            text1: 'OTP Sent',
            text2: 'A new verification code has been sent to your phone.',
          });
        })
        .catch((err: any) => {
          const errMsg = err?.message || err?.data?.message || typeof err === 'string' ? err : 'Failed to resend the code.';
          setLocalError(errMsg);
          Toast.show({
            type: 'error',
            text1: 'Resend Failed',
            text2: errMsg,
          });
        });
    } else if (type === 'signup') {
      // TODO: Dispatch signup resend API
      console.log('Dispatch signup resend API here for phone:', phone);
      Toast.show({
        type: 'success',
        text1: 'OTP Sent',
        text2: 'A new verification code has been sent.',
      });
    }
  };

  const handleChangeText = (text: string, index: number) => {
    if (localError) setLocalError(null);
    
    const cleanedText = text.replace(/[^0-9]/g, '');

    if (cleanedText.length > 1) {
      const pastedChars = cleanedText.slice(0, 6 - index).split('');
      const newOtp = [...otp];
      
      pastedChars.forEach((char, i) => {
        if (index + i < 6) newOtp[index + i] = char;
      });
      
      setOtp(newOtp);
      
      const nextFocusIndex = Math.min(index + pastedChars.length, 5);
      inputs.current[nextFocusIndex]?.focus();
      
      if (newOtp.every(val => val !== '')) Keyboard.dismiss();
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = cleanedText;
    setOtp(newOtp);

    if (cleanedText !== '' && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = ({ nativeEvent }: any, index: number) => {
    if (localError) setLocalError(null);

    if (nativeEvent.key === 'Backspace') {
      if (otp[index] === '' && index > 0) {
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
        inputs.current[index - 1]?.focus();
      }
    }
  };

  return (
    <View style={[styles.main, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
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
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* 1. ANIMATED HEADER */}
          <Animated.View style={{ opacity: headerAnim, transform: getTransform(headerAnim) }}>
            <View style={styles.header}>
              <View style={styles.badgeContainer}>
                <View style={styles.badgeDot} />
                <Text style={styles.badgeText}>Verification</Text>
              </View>
              <Text style={styles.title}>Enter verification{'\n'}code</Text>
              <Text style={styles.subtitle}>
                We've sent a 6-digit code to{'\n'}
                <Text style={styles.subtitleBold}>{phone}</Text>
              </Text>
            </View>
          </Animated.View>

          {/* 2. ANIMATED FORM */}
          <Animated.View style={{ opacity: formAnim, transform: getTransform(formAnim), flex: 1 }}>
            <View style={styles.otpSection}>
              <View 
                style={[styles.otpRow, isLoading && styles.otpRowLoading]} 
                pointerEvents={isLoading ? 'none' : 'auto'}
              >
                {otp.map((val, i) => (
                  <TextInput
                    key={i}
                    ref={(ref) => { inputs.current[i] = ref; }}
                    style={[
                      styles.otpInput, 
                      val ? styles.otpInputActive : null,
                      localError ? styles.otpInputError : null
                    ]}
                    value={val}
                    onChangeText={(text) => handleChangeText(text, i)}
                    onKeyPress={(e) => handleKeyPress(e, i)}
                    keyboardType="number-pad"
                    maxLength={6} 
                    selectTextOnFocus
                    editable={!isLoading}
                    textContentType="oneTimeCode" 
                    autoComplete="sms-otp"
                    cursorColor={colors.primary}
                  />
                ))}
              </View>

              {/* Global Error Container matching other screens */}
              {localError ? (
                <View style={styles.errorContainer}>
                  <Icon name="alert-circle" size={16} color={colors.error || '#FF3B30'} style={{ marginRight: spacing.sm }} />
                  <Text style={styles.errorText}>{localError}</Text>
                </View>
              ) : null}

              <View style={styles.resendContainer}>
                {canResend ? (
                  <TouchableOpacity onPress={handleResend} activeOpacity={0.7} style={styles.resendButton}>
                    <Text style={styles.resendText}>
                      Didn't receive the code? <Text style={styles.resendActive}>Resend Now</Text>
                    </Text>
                  </TouchableOpacity>
                ) : (
                  <Text style={styles.resendText}>
                    Resend code in <Text style={styles.timer}>{formatTime(timer)}</Text>
                  </Text>
                )}
              </View>
            </View>
          </Animated.View>

          {/* 3. ANIMATED FOOTER */}
          <Animated.View style={{ opacity: footerAnim, transform: getTransform(footerAnim) }}>
            <View style={styles.footer}>
              <ButtonPrimary 
                title={isLoading ? "Verifying..." : "Verify & Continue"} 
                onPress={handleVerify}
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
    justifyContent: 'space-between', 
    paddingHorizontal: spacing.lg, 
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxl 
  },
  
  // --- MODERN HEADER STYLING ---
  header: { 
    marginBottom: spacing.xl 
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
    lineHeight: 24,
  },
  subtitleBold: {
    color: colors.textPrimary,
    fontWeight: '700',
  },
  
  // --- OTP SECTION STYLING ---
  otpSection: { 
    alignItems: 'center', 
    marginTop: spacing.md 
  },
  otpRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    width: '100%', 
    marginBottom: spacing.md, 
    gap: 8 
  },
  otpRowLoading: { 
    opacity: 0.6 
  },
  otpInput: { 
    flex: 1, 
    aspectRatio: 1, 
    height: 56, 
    borderWidth: 1.5, 
    borderColor: colors.border, 
    borderRadius: radius.lg, 
    textAlign: 'center', 
    fontSize: 26, 
    fontFamily: 'Poppins-SemiBold', // Use your bold font if available
    fontWeight: '700',
    color: colors.textPrimary, 
    backgroundColor: '#FFFFFF',
    padding: 0, 
    includeFontPadding: false, 
  },
  otpInputActive: { 
    borderColor: colors.primary, 
    borderWidth: 2,
    backgroundColor: colors.primary + '05', // Extremely faint primary tint
  },
  otpInputError: { 
    borderColor: colors.error || '#FF3B30', 
    borderWidth: 2, 
    backgroundColor: '#FFF5F5'
  }, 
  
  // --- ERROR STYLING ---
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5F5',
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: '#FFE1E1',
    marginBottom: spacing.md,
    width: '100%',
  },
  errorText: {
    ...typography.caption, 
    color: colors.error || '#FF3B30', 
    fontWeight: '600',
    flex: 1,
  },
  
  // --- RESEND TIMER STYLING ---
  resendContainer: { 
    marginTop: spacing.xs,
    alignItems: 'center',
  },
  resendButton: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  resendText: { 
    ...typography.body, 
    color: colors.textSecondary 
  },
  timer: { 
    fontWeight: '700', 
    color: colors.textPrimary 
  },
  resendActive: { 
    fontWeight: '700', 
    color: colors.primary 
  }, 
  
  // --- FOOTER STYLING ---
  footer: { 
    marginTop: spacing.xl 
  },
});