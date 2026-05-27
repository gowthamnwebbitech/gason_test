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
import Icon from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';

import { Input } from '@/components/Input';
import { ButtonPrimary } from '@/components/ButtonPrimary';
import { colors, spacing, typography, radius, shadows } from '@/theme';
import { useAppDispatch, useAppSelector } from '@/store';
import { loginUser } from '../store/authThunks';
import { Role } from '../store/authTypes';

interface FormErrors {
  identifier?: string;
  password?: string;
}

export const LoginScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const { isLoading, error: globalError } = useAppSelector((state: any) => state.auth);

  const [role, setRole] = useState<Role>('user');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  // --- SMOOTH ANIMATIONS ---
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current; // Reduced slide distance

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 700,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const handleRoleSwitch = (selectedRole: Role) => {
    if (role === selectedRole) return;
    setRole(selectedRole);
    setIdentifier('');
    setPassword('');
    setErrors({});
    setApiError(null);
  };

  const validateForm = (): boolean => {
    Keyboard.dismiss();
    let isValid = true;
    let newErrors: FormErrors = {};

    if (!identifier.trim()) {
      newErrors.identifier = role === 'user' ? 'Mobile Number is required' : 'Member ID is required';
      isValid = false;
    } else if (role === 'user') {
      const phoneRegex = /^[0-9]{10}$/;
      if (!phoneRegex.test(identifier)) {
        newErrors.identifier = 'Enter a valid 10-digit mobile number';
        isValid = false;
      }
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSignIn = () => {
    if (validateForm()) {
      setApiError(null);

      dispatch(loginUser({ identifier: identifier.trim(), password, role }))
        .unwrap()
        .then(() => {
          setIsSuccess(true);
          Toast.show({
            type: 'success',
            text1: 'Authentication Successful',
            text2: role === 'member' ? 'Securely accessing Member Portal...' : 'Welcome back to Gason!',
          });
        })
        .catch((err: any) => {
          const errMsg = err || 'Incorrect credentials. Please try again.';
          setApiError(errMsg);
          Toast.show({ type: 'error', text1: 'Sign In Failed', text2: errMsg });
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
      {/* SUBTLE PREMIUM GLOW ORBS */}
      <LinearGradient
        colors={['#4f46e510', 'rgba(255,255,255,0)']}
        style={styles.glowAccentTop}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      <LinearGradient
        colors={['#8b5cf608', 'rgba(255,255,255,0)']}
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
            { paddingTop: insets.top + spacing.xl, paddingBottom: Math.max(insets.bottom, spacing.xl) }
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }], flex: 1 }}>
            
            {/* 1. COMPACT HEADER */}
            <View style={styles.header}>
              <View style={[styles.badge, role === 'member' ? styles.badgeMember : styles.badgeUser]}>
                <Icon name={role === 'member' ? 'briefcase' : 'user'} size={12} color={role === 'member' ? colors.info : colors.primary} />
                <Text style={[styles.badgeText, { color: role === 'member' ? colors.info : colors.primary }]}>
                  {role === 'member' ? 'Partner Access' : 'Customer Access'}
                </Text>
              </View>
              <Text style={styles.title}>
                {role === 'user' ? 'Sign in to Gason' : 'Member Portal'}
              </Text>
              <Text style={styles.subtitle}>
                {role === 'user' 
                  ? 'Enter your mobile number and password.' 
                  : 'Enter your authorized Member ID.'}
              </Text>
            </View>

            {/* 2. SLIM SEGMENTED CONTROL */}
            <View style={styles.segmentedControl}>
              <TouchableOpacity
                style={[styles.segmentBtn, role === 'user' && styles.segmentBtnActive]}
                onPress={() => handleRoleSwitch('user')}
                activeOpacity={0.9}
              >
                <Text style={[styles.segmentText, role === 'user' && styles.segmentTextActive]}>User</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.segmentBtn, role === 'member' && styles.segmentBtnActive]}
                onPress={() => handleRoleSwitch('member')}
                activeOpacity={0.9}
              >
                <Text style={[styles.segmentText, role === 'member' && styles.segmentTextActive]}>Member</Text>
              </TouchableOpacity>
            </View>

            {/* 3. TIGHT INPUT FORM */}
            <View style={styles.form}>
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>{role === 'user' ? 'Mobile Number' : 'Member ID'}</Text>
                <Input
                  placeholder={role === 'user' ? "e.g. 9876543210" : "e.g. GSN001"}
                  keyboardType={role === 'user' ? "phone-pad" : "default"}
                  autoCapitalize={role === 'member' ? "characters" : "none"}
                  value={identifier}
                  onChangeText={text => {
                    setIdentifier(role === 'user' ? text.replace(/[^0-9]/g, '') : text);
                    clearError('identifier');
                  }}
                  editable={!isLoading && !isSuccess}
                  maxLength={role === 'user' ? 10 : 20}
                  hasError={!!errors.identifier}
                />
                {errors.identifier && <Text style={styles.fieldErrorText}>{errors.identifier}</Text>}
              </View>

              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Password</Text>
                <Input
                  placeholder="Enter your password"
                  isPassword={true}
                  value={password}
                  onChangeText={text => { setPassword(text); clearError('password'); }}
                  editable={!isLoading && !isSuccess}
                  hasError={!!errors.password}
                />
                {errors.password && <Text style={styles.fieldErrorText}>{errors.password}</Text>}
              </View>

              {/* DYNAMIC FORGOT PASSWORD */}
              <TouchableOpacity
                onPress={() => navigation.navigate('ForgotPassword', { role })}
                style={styles.forgotBtn}
                disabled={isLoading || isSuccess}
                activeOpacity={0.7}
              >
                <Text style={styles.forgotText}>
                  {role === 'member' ? 'Forgot Member Password?' : 'Forgot Password?'}
                </Text>
              </TouchableOpacity>

              {/* GLOBAL ERROR DISPLAY */}
              {displayGlobalError ? (
                <View style={styles.errorContainer}>
                  <Icon name="alert-triangle" size={16} color={colors.error} />
                  <Text style={styles.errorText}>{displayGlobalError}</Text>
                </View>
              ) : null}
            </View>

            {/* 4. ACTIONS & FOOTER */}
            <View style={styles.footerContainer}>
              <ButtonPrimary
                title={isSuccess ? 'Success ✓' : isLoading ? 'Authenticating...' : 'Sign In'}
                onPress={handleSignIn}
                disabled={isLoading || isSuccess}
              />
              
              {/* SIGN UP - STRICTLY FOR USERS ONLY */}
              {role === 'user' ? (
                <View style={styles.signupPrompt}>
                  <Text style={styles.signupText}>New to Gason? </Text>
                  <TouchableOpacity 
                    onPress={() => !(isLoading || isSuccess) && navigation.navigate('Signup')}
                    disabled={isLoading || isSuccess}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.signupLink}>Create an account</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.signupPrompt}>
                  <Text style={[styles.signupText, { color: 'transparent' }]}>-</Text>
                </View>
              )}
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
  
  // Decorative Glows
  glowAccentTop: {
    position: 'absolute',
    top: -100,
    right: -100,
    width: 350,
    height: 350,
    borderRadius: radius.full,
  },
  glowAccentBottom: {
    position: 'absolute',
    bottom: -150,
    left: -100,
    width: 350,
    height: 350,
    borderRadius: radius.full,
  },

  keyboardView: { 
    flex: 1 
  },
  scrollContent: { 
    flexGrow: 1, 
    paddingHorizontal: spacing.xl, 
  },
  
  // Header
  header: { 
    marginBottom: spacing.lg, // Reduced from xxl
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: 4, // Reduced
    borderRadius: radius.full,
    marginBottom: spacing.sm, // Reduced
  },
  badgeUser: { backgroundColor: colors.primaryLight },
  badgeMember: { backgroundColor: colors.info + '15' },
  badgeText: {
    ...typography.caption,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginLeft: 4,
    fontSize: 11, // Slightly smaller
  },
  title: { 
    ...typography.screenTitle, 
    fontSize: 30, // Reduced from 34
    lineHeight: 36, // Reduced from 42
    color: colors.textPrimary, 
    letterSpacing: -0.5, 
    marginBottom: 4,
  },
  subtitle: { 
    ...typography.body, // Used body instead of bodyLarge
    color: colors.textSecondary,
    lineHeight: 20,
  },
  
  // Segmented Control
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F7', 
    borderRadius: radius.md, // Sharper radius
    padding: 3, // Thinner padding
    marginBottom: spacing.xl, // Reduced from xxl
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 8, // Reduced from 12
    alignItems: 'center',
    borderRadius: radius.sm,
  },
  segmentBtnActive: {
    backgroundColor: '#FFFFFF', 
    ...shadows.button,
  },
  segmentText: {
    ...typography.body, // Reduced to standard body size
    color: colors.textMuted,
    fontWeight: '600',
  },
  segmentTextActive: {
    color: colors.textPrimary,
  },

  // Form Inputs
  form: { 
    marginBottom: spacing.lg, // Reduced from xxl
  },
  inputWrapper: {
    marginBottom: spacing.md, // Reduced from lg
  },
  inputLabel: {
    ...typography.caption, // Reduced from body
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 4, // Tighter margin
    marginLeft: 2,
  },
  fieldErrorText: { 
    ...typography.caption, 
    color: colors.error, 
    fontWeight: '500', 
    marginTop: 4, 
    marginLeft: spacing.xs 
  },
  forgotBtn: { 
    alignSelf: 'flex-end', 
    paddingVertical: 4, // Reduced
    marginTop: -4, // Pulled slightly closer to the password field
  },
  forgotText: { 
    ...typography.caption, // Reduced from body
    color: colors.primary, 
    fontWeight: '700' 
  },
  
  // Errors
  errorContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#FFF5F5', 
    padding: spacing.sm, // Reduced from md
    borderRadius: radius.sm, // Sharper radius
    borderWidth: 1, 
    borderColor: '#FFE1E1', 
    marginTop: spacing.xs 
  },
  errorText: { 
    ...typography.caption, 
    color: colors.error, 
    fontWeight: '600', 
    flex: 1,
    marginLeft: spacing.xs,
  },
  
  // Footer
  footerContainer: {
    marginTop: 'auto',
    paddingTop: spacing.md,
  },
  signupPrompt: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center',
    marginTop: spacing.lg, // Reduced from xl
  },
  signupText: { 
    ...typography.body, // Reduced from bodyLarge
    color: colors.textSecondary 
  },
  signupLink: { 
    ...typography.body, 
    fontWeight: '700', 
    color: colors.textPrimary, 
    textDecorationLine: 'underline',
  },
});