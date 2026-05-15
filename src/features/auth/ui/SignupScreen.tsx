import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';

import { Input } from '@/components/Input';
import { ButtonPrimary } from '@/components/ButtonPrimary';
import { colors, spacing, typography } from '@/theme';
import { useAppDispatch, useAppSelector } from '@/store';
import { signupUser } from '../store';

export const SignupScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();

  const { isLoading, error } = useAppSelector(state => state.auth);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAccepted, setIsAccepted] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (localError) setLocalError(null);
  }, [name, phone, email, password, isAccepted]);

  const validateForm = () => {
    if (!name.trim() || !phone.trim() || !email.trim() || !password.trim()) {
      setLocalError('Please fill in all fields.');
      return false;
    }
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      setLocalError('Please enter a valid 10-digit mobile number.');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setLocalError('Please enter a valid email address.');
      return false;
    }
    if (!isAccepted) {
      setLocalError('You must accept the Terms & Privacy to continue.');
      return false;
    }
    return true;
  };

  const handleSignup = () => {
    Keyboard.dismiss();
    if (validateForm()) {
      dispatch(signupUser({ 
        name: name.trim(), 
        phone: phone.trim(), 
        email: email.trim(), 
        password 
      }))
        .unwrap()
        .then(() => {
          navigation.navigate('OTP', { phone: phone.trim() });
        })
        .catch((err) => {
          console.log('Signup Failed: ', err);
        });
    }
  };

  const displayError = localError || error;

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
              <Text style={styles.title}>Create Your Account</Text>
              <Text style={styles.subtitle}>Fill in your details to get started</Text>
            </View>

            <View style={styles.form}>
              <Input placeholder="User Name" value={name} onChangeText={setName} editable={!isLoading} autoCapitalize="words" />
              <Input placeholder="Mobile Number" keyboardType="phone-pad" value={phone} onChangeText={setPhone} editable={!isLoading} maxLength={10} />
              <Input placeholder="Email" keyboardType="email-address" value={email} onChangeText={setEmail} editable={!isLoading} autoCapitalize="none" />
              <Input placeholder="Password" isPassword={true} value={password} onChangeText={setPassword} editable={!isLoading} />

              {displayError && (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>• {displayError}</Text>
                </View>
              )}

              <TouchableOpacity 
                style={styles.termsRow} 
                onPress={() => !isLoading && setIsAccepted(!isAccepted)} 
                activeOpacity={0.7}
              >
                <View style={[styles.checkbox, isAccepted && styles.checkboxActive]}>
                  {isAccepted && <Icon name="check" size={12} color={colors.white} />}
                </View>
                <Text style={styles.termsText}>
                  I accept <Text style={styles.termsBold}>Terms & Privacy</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.bottomSection}>
            <ButtonPrimary 
              title={isLoading ? 'Creating Account...' : 'Sign Up'} 
              onPress={handleSignup} 
              disabled={isLoading} 
            />

            <View style={styles.footer}>
              <Text style={styles.footerText}>
                Already have an account?{' '}
                <Text 
                  style={[styles.link, isLoading && styles.disabledLink]} 
                  onPress={() => !isLoading && navigation.navigate('Login')}
                >
                  Sign In
                </Text>
              </Text>
            </View>
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
  header: { marginTop: spacing.lg, marginBottom: spacing.lg },
  title: { ...typography.screenTitle, color: colors.primary, fontSize: 24 },
  subtitle: { ...typography.body, color: colors.textMuted, marginTop: spacing.xs },
  form: { gap: spacing.md },
  errorContainer: { backgroundColor: '#FFEFEF', padding: spacing.sm, borderRadius: 8, borderWidth: 1, borderColor: '#FFD6D6' },
  errorText: { color: colors.error, ...typography.caption, fontWeight: '500' },
  termsRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.xs },
  checkbox: { width: 20, height: 20, borderRadius: 6, borderWidth: 1.5, borderColor: colors.primary, marginRight: spacing.sm, justifyContent: 'center', alignItems: 'center' },
  checkboxActive: { backgroundColor: colors.primary },
  termsText: { ...typography.caption, color: colors.textSecondary },
  termsBold: { fontWeight: 'bold', color: colors.textPrimary },
  bottomSection: { gap: spacing.xl, marginTop: spacing.xxl },
  footer: { alignItems: 'center' },
  footerText: { ...typography.body, textAlign: 'center' },
  link: { ...typography.link, fontWeight: 'bold', color: colors.black },
  disabledLink: { color: colors.textMuted },
});