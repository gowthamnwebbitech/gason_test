import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';

import { useAppSelector, useAppDispatch } from '@/store';
import { logoutUser } from '@/features/auth/store/authThunks';
import { colors, typography, spacing, radius, shadows } from '@/theme';

export const MemberProfileScreen = () => {
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.auth.user);

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to log out of your account?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: () => dispatch(logoutUser()),
        },
      ],
    );
  };

  const DetailRow = ({
    icon,
    label,
    value,
    isLast = false,
  }: {
    icon: string;
    label: string;
    value?: string | null;
    isLast?: boolean;
  }) => (
    <View style={[styles.detailRow, !isLast && styles.rowBorder]}>
      <View style={styles.rowLeft}>
        <View style={styles.iconContainer}>
          <Icon name={icon} size={18} color={colors.textSecondary} />
        </View>
        <Text style={styles.detailLabel}>{label}</Text>
      </View>
      <Text style={styles.detailValue} numberOfLines={1} ellipsizeMode="tail">
        {value || 'Not provided'}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + spacing.xl },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerSection}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarInitial}>
                {user?.name?.charAt(0).toUpperCase() || 'M'}
              </Text>
            </View>
            <View style={styles.verifiedBadge}>
              <Icon name="check" size={12} color="#FFFFFF" />
            </View>
          </View>
          <Text style={styles.name}>{user?.name}</Text>
          <View style={styles.roleBadge}>
            <View style={styles.roleDot} />
            <Text style={styles.roleText}>Authorized Member</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Work Profile</Text>
          <View style={styles.card}>
            <DetailRow
              icon="hash"
              label="Employee ID"
              value={user?.employee_code}
            />
            <DetailRow
              icon="briefcase"
              label="Designation"
              value={user?.designation}
            />
            <DetailRow
              icon="calendar"
              label="Joined Date"
              value={user?.join_date}
              isLast
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Information</Text>
          <View style={styles.card}>
            <DetailRow icon="mail" label="Email" value={user?.email} />
            <DetailRow icon="phone" label="Phone" value={user?.phone} />
            <DetailRow
              icon="map-pin"
              label="Location"
              value={user?.address}
              isLast
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.card}>
            <TouchableOpacity style={styles.actionRow} activeOpacity={0.7}>
              <View style={styles.rowLeft}>
                <View style={styles.iconContainer}>
                  <Icon name="shield" size={18} color={colors.textSecondary} />
                </View>
                <Text style={styles.detailLabel}>Privacy & Security</Text>
              </View>
              <Icon name="chevron-right" size={20} color={colors.border} />
            </TouchableOpacity>

            <View style={styles.rowBorder} />

            <TouchableOpacity
              style={styles.actionRow}
              onPress={handleLogout}
              activeOpacity={0.7}
            >
              <View style={styles.rowLeft}>
                <View
                  style={[styles.iconContainer, { backgroundColor: '#FFF5F5' }]}
                >
                  <Icon name="log-out" size={18} color={colors.error} />
                </View>
                <Text
                  style={[
                    styles.detailLabel,
                    { color: colors.error, fontWeight: '600' },
                  ]}
                >
                  Sign Out
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Gason App Version 1.0.0</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  scrollContent: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxxl },
  headerSection: { alignItems: 'center', marginBottom: spacing.xxxl },
  avatarContainer: { position: 'relative', marginBottom: spacing.md },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatarInitial: {
    ...typography.screenTitle,
    fontSize: 40,
    color: colors.primaryDark,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  name: { ...typography.screenTitle, fontSize: 26, marginBottom: spacing.xs },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F7F7F9',
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: radius.full,
  },
  roleDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.info,
    marginRight: spacing.sm,
  },
  roleText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  section: { marginBottom: spacing.xxl },
  sectionTitle: {
    ...typography.caption,
    color: colors.textMuted,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginLeft: spacing.sm,
    marginBottom: spacing.sm,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    ...shadows.card,
    shadowOpacity: 0.04,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
  },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: colors.divider },
  rowLeft: { flexDirection: 'row', alignItems: 'center' },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    backgroundColor: '#F7F7F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  detailLabel: {
    ...typography.body,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  detailValue: {
    ...typography.body,
    color: colors.textSecondary,
    maxWidth: '50%',
    textAlign: 'right',
  },
  footer: { marginTop: spacing.xl, alignItems: 'center' },
  footerText: { ...typography.caption, color: colors.textMuted },
});
