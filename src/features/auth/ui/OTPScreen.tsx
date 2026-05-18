import React, { useRef, useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView,
  Keyboard,
  TouchableOpacity
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ButtonPrimary } from '@/components/ButtonPrimary';
import { colors, spacing, typography, radius } from '@/theme';
import { useAppDispatch, useAppSelector } from '@/store';
import { verifySignupOtp, forgotPassword } from '../store';

export const OTPScreen = ({ navigation, route }: any) => {
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  
  // Only pull isLoading. We handle errors locally so it never starts red on load.
  const { isLoading } = useAppSelector((state: any) => state.auth);

  const type = route?.params?.type || 'signup'; 
  const phone = route?.params?.phone || '';
  const userId = route?.params?.userId || '';

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [localError, setLocalError] = useState<string | null>(null);
  
  // Timer State
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  
  const inputs = useRef<Array<TextInput | null>>([]);

  const isOtpComplete = otp.every(val => val !== '');

  // 1. Countdown Timer Logic
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

  // 2. Auto-submit ONLY when completely filled
  useEffect(() => {
    if (isOtpComplete && !isLoading) {
      handleVerify();
    }
  }, [isOtpComplete]);

  // 3. Resend OTP Handler
  const handleResend = () => {
    if (!canResend) return;
    
    // Reset UI & Errors safely
    setTimer(60);
    setCanResend(false);
    setLocalError(null);
    setOtp(['', '', '', '', '', '']); 
    inputs.current[0]?.focus(); 

    if (type === 'forgot') {
      dispatch(forgotPassword(phone))
        .unwrap()
        .catch((err: any) => setLocalError(err || 'Failed to resend OTP.'));
    } else if (type === 'signup') {
      console.log('Dispatch signup resend API here for phone:', phone);
    }
  };

  // 4. Advanced Smooth Typing & Paste Logic
  const handleChangeText = (text: string, index: number) => {
    // INSTANT RECOVERY: Clear any red errors the second they start typing again
    if (localError) setLocalError(null);
    
    const cleanedText = text.replace(/[^0-9]/g, '');

    // Handle Copy & Paste
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

    // Normal typing
    const newOtp = [...otp];
    newOtp[index] = cleanedText;
    setOtp(newOtp);

    // Auto-focus next input
    if (cleanedText !== '' && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  // 5. Flawless Backspace UX
  const handleKeyPress = ({ nativeEvent }: any, index: number) => {
    // INSTANT RECOVERY: Clear red errors on backspace
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

  // 6. Strict Validation & Verification (Handles Empty State)
  const handleVerify = () => {
    if (isLoading) return;
    
    const otpString = otp.join('');

    // Pre-Validation: Trigger error if they try to verify while empty or incomplete
    if (otpString.length !== 6 || !/^\d{6}$/.test(otpString)) {
      setLocalError('Please enter all 6 digits to verify.');
      return;
    }

    Keyboard.dismiss();

    if (type === 'signup') {
      dispatch(verifySignupOtp({ user_id: userId, otp: otpString }))
        .unwrap()
        .then(() => {
          navigation.navigate('Login'); 
        })
        .catch((err: any) => {
          // CATCH MISMATCH: Set local error so UI turns red ONLY after failing
          const errorMessage = typeof err === 'string' ? err : err?.message || 'OTP Mismatch. Please try again.';
          setLocalError(errorMessage);
          
          setOtp(['', '', '', '', '', '']);
          inputs.current[0]?.focus();
        });
    } else if (type === 'forgot') {
      navigation.navigate('NewPassword', { phone, otp: otpString });
    }
  };

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
              <Text style={styles.title}>Verify phone number</Text>
              <Text style={styles.subtitle}>We sent a verification code to {phone}</Text>
            </View>

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
                      localError ? styles.otpInputError : null // Visually turns boxes RED on empty/mismatch error
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
                  />
                ))}
              </View>

              {/* Displays the Error text ONLY when localError exists */}
              {localError ? (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>• {localError}</Text>
                </View>
              ) : null}

              {/* Dynamic Resend Timer / Button */}
              <View style={styles.resendContainer}>
                {canResend ? (
                  <TouchableOpacity onPress={handleResend} activeOpacity={0.7}>
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
          </View>

          <View style={styles.footer}>
            {/* The button is always active so it can trigger the "Empty" error if tapped early */}
            <ButtonPrimary 
              title={isLoading ? "Verifying..." : "Verify"} 
              onPress={handleVerify}
              disabled={isLoading}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  main: { flex: 1, backgroundColor: '#FFFFFF' }, // Maintained strict white background
  keyboardView: { flex: 1 },
  scrollContent: { 
    flexGrow: 1, 
    justifyContent: 'space-between', 
    paddingHorizontal: spacing.lg, 
    paddingBottom: spacing.xxl 
  },
  header: { marginTop: spacing.xl },
  title: { ...typography.screenTitle, color: colors.primary, fontSize: 24 },
  subtitle: { ...typography.body, color: colors.textMuted, marginTop: spacing.xs, lineHeight: 22 },
  
  otpSection: { alignItems: 'center', marginTop: spacing.xl },
  otpRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    width: '100%', 
    marginBottom: spacing.lg, 
    gap: 8 
  },
  otpRowLoading: {
    opacity: 0.6,
  },
  otpInput: { 
    flex: 1, 
    aspectRatio: 1, 
    height: 55, 
    borderWidth: 1, 
    borderColor: colors.border, 
    borderRadius: radius.md, 
    textAlign: 'center', 
    fontSize: 24, 
    color: colors.textPrimary, 
    backgroundColor: '#FFFFFF',
    padding: 0, 
    includeFontPadding: false, 
  },
  otpInputActive: { borderColor: colors.primary, borderWidth: 2 },
  
  // --- VISUAL ERROR STATE STYLE ---
  otpInputError: { 
    borderColor: colors.error || '#FF3B30', 
    borderWidth: 2, 
    backgroundColor: '#FFF5F5' // Very light red background to indicate error
  }, 
  
  errorContainer: { 
    backgroundColor: '#FFEFEF', 
    padding: spacing.sm, 
    borderRadius: 8, 
    borderWidth: 1, 
    borderColor: '#FFD6D6', 
    marginBottom: spacing.md, 
    width: '100%' 
  },
  errorText: { 
    color: colors.error || '#FF3B30',
    ...typography.caption, 
    fontWeight: '500' 
  },
  
  resendContainer: { marginTop: spacing.sm },
  resendText: { ...typography.body, color: colors.textSecondary },
  timer: { fontWeight: 'bold', color: colors.textPrimary },
  resendActive: { fontWeight: 'bold', color: colors.primary }, 
  
  footer: { marginTop: spacing.xl },
});