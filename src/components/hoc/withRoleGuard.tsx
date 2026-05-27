import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';

import { useAppSelector } from '@/store';
import { Role } from '@/features/auth/store/authTypes';
import { colors, typography, spacing, radius } from '@/theme';

export const withRoleGuard = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  allowedRoles: Role[]
) => {
  return (props: P) => {
    const user = useAppSelector((state) => state.auth.user);
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();

    // Check if user exists and their role is included in the allowed list
    if (!user || !allowedRoles.includes(user.role)) {
      return (
        <View style={[styles.container, { paddingTop: insets.top, paddingBottom: Math.max(insets.bottom, spacing.xl) }]}>
          <View style={styles.content}>
            <View style={styles.iconWrapper}>
              <Icon name="shield-off" size={36} color={colors.error} />
            </View>
            <Text style={styles.title}>Access Restricted</Text>
            <Text style={styles.subtitle}>
              You do not have the required permissions to view this screen.
            </Text>
          </View>

          {/* Escape hatch so the user isn't stuck on a dead-end screen */}
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => {
              if (navigation.canGoBack()) {
                navigation.goBack();
              } else {
                // Fallback route if deep-linked without history
                navigation.navigate('Home' as never); 
              }
            }}
            activeOpacity={0.8}
          >
            <Icon name="arrow-left" size={20} color={colors.textPrimary} style={styles.backIcon} />
            <Text style={styles.backText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      );
    }

    // If authorized, render the requested screen
    return <WrappedComponent {...props} />;
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', // Strict pure white layout requirement applied
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xl,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconWrapper: {
    width: 80,
    height: 80,
    borderRadius: radius.full,
    backgroundColor: '#FFF5F5', // Soft error background for contrast
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.heading,
    fontSize: 24,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  subtitle: {
    ...typography.bodyLarge,
    color: colors.textMuted,
    textAlign: 'center',
    paddingHorizontal: spacing.md,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.md,
    backgroundColor: '#F7F7F9',
    borderRadius: radius.md,
    marginTop: spacing.xl,
  },
  backIcon: {
    marginRight: spacing.sm,
  },
  backText: {
    ...typography.bodyLarge,
    color: colors.textPrimary,
    fontWeight: '600',
  },
});