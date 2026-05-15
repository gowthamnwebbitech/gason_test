import React, { useRef, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView 
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ButtonPrimary } from '@/components/ButtonPrimary';
import { colors, spacing, typography, radius } from '@/theme';

export const OTPScreen = ({ navigation, route }: any) => {
  const insets = useSafeAreaInsets();
  const phone = route?.params?.phone || 'your number';

  // State now holds 6 elements
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputs = useRef<Array<TextInput | null>>([]);

  const handleChangeText = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Auto focus next input (up to index 5)
    if (text && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = ({ nativeEvent }: any, index: number) => {
    if (nativeEvent.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const isOtpComplete = otp.every(val => val !== '');

  const handleVerify = () => {
    if (isOtpComplete) {
      navigation.navigate('NewPassword');
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
        >
          <View>
            <View style={styles.header}>
              <Text style={styles.title}>Verify phone number</Text>
              <Text style={styles.subtitle}>We sent a verification code to {phone}</Text>
            </View>

            <View style={styles.otpSection}>
              <View style={styles.otpRow}>
                {otp.map((val, i) => (
                  <TextInput
                    key={i}
                    ref={(ref) => { inputs.current[i] = ref; }}
                    style={[styles.otpInput, val ? styles.otpInputActive : null]}
                    value={val}
                    onChangeText={(text) => handleChangeText(text.replace(/[^0-9]/g, ''), i)}
                    onKeyPress={(e) => handleKeyPress(e, i)}
                    keyboardType="number-pad"
                    maxLength={1}
                    selectTextOnFocus
                  />
                ))}
              </View>
              <Text style={styles.resendText}>
                Resend code in <Text style={styles.timer}>55 s</Text>
              </Text>
            </View>
          </View>

          <View style={styles.footer}>
            <ButtonPrimary 
              title="Verify" 
              onPress={handleVerify}
              disabled={!isOtpComplete}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  main: { flex: 1, backgroundColor: '#FFFFFF' },
  keyboardView: { flex: 1 },
  scrollContent: { 
    flexGrow: 1, 
    paddingHorizontal: spacing.lg, 
    justifyContent: 'space-between',
    paddingBottom: spacing.lg
  },
  header: { marginTop: spacing.xl },
  title: { ...typography.screenTitle, color: colors.primary, fontSize: 24 },
  subtitle: { ...typography.body, color: colors.textMuted, marginTop: spacing.xs, lineHeight: 22 },
  otpSection: { alignItems: 'center', marginTop: spacing.xl },
  otpRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    width: '100%', 
    marginBottom: spacing.xl,
    gap: 8, // Adds spacing natively in newer RN versions
  },
  otpInput: { 
    flex: 1, // Ensures all 6 inputs distribute evenly without breaking screen width
    aspectRatio: 1, // Keeps them square regardless of screen size
    maxHeight: 55, // Prevents them from getting too huge on tablets
    borderWidth: 1, 
    borderColor: colors.border, 
    borderRadius: radius.md, 
    textAlign: 'center', 
    fontSize: 22, 
    color: colors.textPrimary,
    backgroundColor: '#FFFFFF' 
  },
  otpInputActive: { borderColor: colors.primary, borderWidth: 2 },
  resendText: { ...typography.body, color: colors.textPrimary },
  timer: { fontWeight: 'bold', color: colors.primary },
  footer: { marginTop: spacing.xxl },
});