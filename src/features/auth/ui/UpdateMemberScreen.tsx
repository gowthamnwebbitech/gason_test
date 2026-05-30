import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/Feather';

import { Input } from '@/components/Input';
import { ButtonPrimary } from '@/components/ButtonPrimary';
import { colors, spacing, typography, radius } from '@/theme';
import { useAppDispatch, useAppSelector } from '@/store';
import { updateMemberId, logoutUser } from '../store/authThunks';

export const UpdateMemberScreen = () => {
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const { user, isLoading } = useAppSelector((state: any) => state.auth);

  const [memberId, setMemberId] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleUpdate = () => {
    Keyboard.dismiss();
    setError(null);

    if (!memberId.trim()) {
      setError('Member ID is required.');
      return;
    }
    if (!/^[A-Z0-9]+$/i.test(memberId.trim())) {
      setError('Member ID must be alphanumeric (e.g., GSN2168).');
      return;
    }

    if (!user?.id) {
      setError('System error: User ID missing.');
      return;
    }

    dispatch(
      updateMemberId({
        member_id: memberId.trim().toUpperCase(),
        customer_id: user.id, // Sends current authenticated user's ID
      })
    )
      .unwrap()
      .then(() => {
        Toast.show({
          type: 'success',
          text1: 'Verification Successful',
          text2: 'Your Member ID has been verified and linked.',
        });
        // RootNavigator will automatically unmount this screen and mount AppStack
      })
      .catch((err: any) => {
        setError(err || 'Failed to update Member ID. Please check and try again.');
        Toast.show({
          type: 'error',
          text1: 'Update Failed',
          text2: err || 'Member ID could not be verified.',
        });
      });
  };

  return (
    <View style={styles.main}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={[styles.content, { paddingTop: insets.top + spacing.xl }]}>
          <View style={styles.header}>
            <View style={styles.iconCircle}>
              <Icon name="link" size={32} color={colors.primary} />
            </View>
            <Text style={styles.title}>Action Required</Text>
            <Text style={styles.subtitle}>
              Your account requires a valid Member ID to access the dashboard. Please link your ID below to continue.
            </Text>
          </View>

          <View style={styles.form}>
            <Input
              placeholder="Enter Member ID (e.g., GSN2168)"
              autoCapitalize="characters"
              value={memberId}
              onChangeText={t => {
                setMemberId(t.replace(/[^A-Za-z0-9]/g, '').toUpperCase());
                setError(null);
              }}
              editable={!isLoading}
              maxLength={15}
              hasError={!!error}
            />
            {error && <Text style={styles.errorText}>{error}</Text>}
          </View>

          <View style={styles.footer}>
            <ButtonPrimary
              title={isLoading ? 'Verifying...' : 'Verify & Continue'}
              onPress={handleUpdate}
              disabled={isLoading}
            />

            <TouchableOpacity
              style={styles.logoutBtn}
              onPress={() => dispatch(logoutUser())}
              disabled={isLoading}
              activeOpacity={0.7}
            >
              <Text style={styles.logoutText}>Use a different account</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  main: { 
    flex: 1, 
    backgroundColor: '#FFFFFF', 
  },
  keyboardView: { 
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing.xl,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.screenTitle,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    paddingHorizontal: spacing.md,
  },
  form: {
    marginBottom: spacing.xxl,
  },
  errorText: {
    ...typography.caption,
    color: colors.error,
    marginTop: spacing.xs,
    marginLeft: spacing.xs,
  },
  footer: {
    marginTop: 'auto',
    marginBottom: spacing.xxl,
    gap: spacing.lg,
  },
  logoutBtn: {
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  logoutText: {
    ...typography.body,
    color: colors.textMuted,
    textDecorationLine: 'underline',
  },
});