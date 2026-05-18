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

// Define our error state shape
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

  // Pull global loading and API errors from Redux
  const { isLoading, error: globalError } = useAppSelector((state: any) => state.auth);

  // Form Values
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAccepted, setIsAccepted] = useState(false);

  // Field-level Errors
  const [errors, setErrors] = useState<FormErrors>({});

  // Formik-style Validation Engine
  const validateForm = (): boolean => {
    Keyboard.dismiss();
    let isValid = true;
    let newErrors: FormErrors = {};

    // 1. Name Validation
    if (!name.trim()) {
      newErrors.name = 'User Name is required.';
      isValid = false;
    } else if (name.trim().length < 3) {
      newErrors.name = 'Name must be at least 3 characters.';
      isValid = false;
    }

    // 2. Phone Validation
    const phoneRegex = /^[0-9]{10}$/;
    if (!phone.trim()) {
      newErrors.phone = 'Mobile Number is required.';
      isValid = false;
    } else if (!phoneRegex.test(phone)) {
      newErrors.phone = 'Please enter a valid 10-digit mobile number.';
      isValid = false;
    }

    // 3. Email Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = 'Email Address is required.';
      isValid = false;
    } else if (!emailRegex.test(email)) {
      newErrors.email = 'Please enter a valid email address.';
      isValid = false;
    }

    // 4. Password Validation (Laravel min:6)
    if (!password) {
      newErrors.password = 'Password is required.';
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long.';
      isValid = false;
    }

    // 5. Terms Validation
    if (!isAccepted) {
      newErrors.terms = 'You must accept the Terms & Privacy to continue.';
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
        })
      )
        .unwrap()
        .then((user) => {
          // Pass the generated user ID and phone to the OTP screen
          navigation.navigate('OTP', { 
            type: 'signup', 
            phone: phone.trim(), 
            userId: user.id 
          });
        })
        .catch((err: any) => {
          console.log('Signup Failed:', err);
        });
    }
  };

  // Helper to clear a specific field's error instantly when the user types
  const clearError = (field: keyof FormErrors) => {
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
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
              <Text style={styles.title}>Create Your Account</Text>
              <Text style={styles.subtitle}>
                Fill in your details to get started
              </Text>
            </View>

            <View style={styles.form}>
              
              {/* --- NAME INPUT --- */}
              <View style={styles.inputGroup}>
                <Input
                  placeholder="User Name"
                  value={name}
                  onChangeText={(text: string) => {
                    setName(text);
                    clearError('name');
                  }}
                  editable={!isLoading}
                  autoCapitalize="words"
                  hasError={!!errors.name} // Triggers red border in your custom Input
                />
                {errors.name && <Text style={styles.fieldErrorText}>{errors.name}</Text>}
              </View>

              {/* --- PHONE INPUT --- */}
              <View style={styles.inputGroup}>
                <Input
                  placeholder="Mobile Number"
                  keyboardType="phone-pad"
                  value={phone}
                  onChangeText={(text: string) => {
                    setPhone(text.replace(/[^0-9]/g, '')); // Enforce numbers
                    clearError('phone');
                  }}
                  editable={!isLoading}
                  maxLength={10}
                  hasError={!!errors.phone}
                />
                {errors.phone && <Text style={styles.fieldErrorText}>{errors.phone}</Text>}
              </View>

              {/* --- EMAIL INPUT --- */}
              <View style={styles.inputGroup}>
                <Input
                  placeholder="Email"
                  keyboardType="email-address"
                  value={email}
                  onChangeText={(text: string) => {
                    setEmail(text);
                    clearError('email');
                  }}
                  editable={!isLoading}
                  autoCapitalize="none"
                  hasError={!!errors.email}
                />
                {errors.email && <Text style={styles.fieldErrorText}>{errors.email}</Text>}
              </View>

              {/* --- PASSWORD INPUT --- */}
              <View style={styles.inputGroup}>
                <Input
                  placeholder="Password"
                  isPassword={true}
                  value={password}
                  onChangeText={(text: string) => {
                    setPassword(text);
                    clearError('password');
                  }}
                  editable={!isLoading}
                  hasError={!!errors.password}
                />
                {errors.password && <Text style={styles.fieldErrorText}>{errors.password}</Text>}
              </View>

              {/* --- GLOBAL BACKEND ERROR --- */}
              {globalError ? (
                <View style={styles.globalErrorContainer}>
                  <Text style={styles.globalErrorText}>• {globalError}</Text>
                </View>
              ) : null}

              {/* --- TERMS CHECKBOX --- */}
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
                  <View style={[styles.checkbox, isAccepted && styles.checkboxActive, errors.terms ? styles.checkboxError : null]}>
                    {isAccepted && (
                      <Icon name="check" size={12} color={colors.white} />
                    )}
                  </View>
                  <Text style={styles.termsText}>
                    I accept <Text style={styles.termsBold}>Terms & Privacy</Text>
                  </Text>
                </TouchableOpacity>
                {errors.terms && <Text style={styles.fieldErrorText}>{errors.terms}</Text>}
              </View>

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
  main: {
    flex: 1,
    backgroundColor: '#FFFFFF', // Guaranteed strict white background
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  header: {
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.screenTitle,
    color: colors.primary,
    fontSize: 24,
  },
  subtitle: {
    ...typography.body,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  form: {
    gap: spacing.md,
  },
  
  // --- FIELD ERROR STYLING ---
  inputGroup: {
    marginBottom: spacing.xs,
  },
  fieldErrorText: {
    color: colors.error || '#FF3B30', // GUARANTEED RED FALLBACK
    ...typography.caption,
    marginTop: 4,
    marginLeft: 4,
    fontWeight: '500',
  },

  // --- GLOBAL ERROR STYLING ---
  globalErrorContainer: {
    backgroundColor: '#FFEFEF',
    padding: spacing.sm,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFD6D6',
    marginBottom: spacing.xs,
  },
  globalErrorText: {
    color: colors.error || '#FF3B30', // GUARANTEED RED FALLBACK
    ...typography.caption,
    fontWeight: '500',
  },

  // --- TERMS AND CONDITIONS STYLING ---
  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: colors.primary,
    marginRight: spacing.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxActive: {
    backgroundColor: colors.primary,
  },
  checkboxError: {
    borderColor: colors.error || '#FF3B30', // Turns the checkbox red if forgotten!
    backgroundColor: '#FFF5F5',
  },
  termsText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  termsBold: {
    fontWeight: 'bold',
    color: colors.textPrimary,
  },

  bottomSection: {
    gap: spacing.xl,
    marginTop: spacing.xl,
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    ...typography.body,
    textAlign: 'center',
  },
  link: {
    ...typography.link,
    fontWeight: 'bold',
    color: colors.black,
  },
  disabledLink: {
    color: colors.textMuted,
  },
});