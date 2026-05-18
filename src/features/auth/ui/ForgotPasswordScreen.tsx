import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ButtonPrimary } from '@/components/ButtonPrimary';
import { Input } from '@/components/Input';
import { colors, spacing, typography } from '@/theme';
import { useAppDispatch, useAppSelector } from '@/store';
import { forgotPassword } from '../store';

export const ForgotPasswordScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state: any) => state.auth);

  const [phone, setPhone] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const handleNext = () => {
    if (phone.length < 10) {
      setLocalError('Please enter a valid 10-digit phone number.');
      return;
    }
    setLocalError(null);

    // Call Laravel API: /member/forgot-password
    dispatch(forgotPassword(phone.trim()))
      .unwrap()
      .then(() => {
        // Pass the phone and type to OTP screen
        navigation.navigate('OTP', { type: 'forgot', phone: phone.trim() });
      })
      .catch((err: any) => {
        setLocalError(err || 'Failed to send OTP.');
      });
  };

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
              <Text style={styles.title}>Forgot Password</Text>
              <Text style={styles.subtitle}>
                Don't worry! Enter your phone number so we can send you an OTP
                to reset your password.
              </Text>
            </View>

            <View style={styles.form}>
              <Input
                placeholder="Mobile Number"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={(text: string) => {
                  setPhone(text.replace(/[^0-9]/g, ''));
                  if (localError) setLocalError(null);
                }}
                maxLength={10}
                editable={!isLoading}
              />

              {localError && (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>• {localError}</Text>
                </View>
              )}
            </View>
          </View>

          <View style={styles.footer}>
            <ButtonPrimary
              title={isLoading ? 'Sending...' : 'Next'}
              onPress={handleNext}
              disabled={isLoading || phone.length < 10}
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
    lineHeight: 22,
  },
  form: { gap: spacing.md },
  errorContainer: {
    backgroundColor: '#FFEFEF',
    padding: spacing.sm,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFD6D6',
  },
  errorText: { color: colors.error, ...typography.caption, fontWeight: '500' },
  footer: { marginTop: spacing.xl },
});
