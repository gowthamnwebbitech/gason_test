import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { Header } from '@/components/header';
import { colors, spacing, typography, radius, shadows } from '@/theme';

const menuItems = [
  { icon: 'box', label: 'My Orders', route: 'Orders' },
  { icon: 'map-pin', label: 'Saved Addresses', route: 'Addresses' },
  { icon: 'credit-card', label: 'Payment Methods', route: 'Payments' },
  { icon: 'bell', label: 'Notifications', route: 'Notifications' },
  { icon: 'shield', label: 'Security & Privacy', route: 'Security' },
  { icon: 'help-circle', label: 'Help & Support', route: 'Support' },
];

export const ProfileScreen = ({ navigation }: any) => {
  return (
    <View style={styles.main}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent={true}
      />

      <Header
        variant="standard"
        title="Profile"
        rightIcon="settings"
        useTopInset={true}
        onRightPress={() => navigation.navigate('Settings')}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* User Info Header */}
        <View style={styles.userSection}>
          <View style={styles.avatarContainer}>
            <Image
              source={{
                uri: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200&auto=format&fit=crop',
              }}
              style={styles.avatar}
            />
            <TouchableOpacity style={styles.editAvatarBtn}>
              <Icon name="camera" size={14} color={colors.white} />
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>Mr. J. Bala Vijai Kumar</Text>
          <Text style={styles.userId}>Gason ID: GAS-0982341</Text>

          <TouchableOpacity
            style={styles.editProfileBtn}
            onPress={() => navigation.navigate('EditProfile')}
          >
            <Text style={styles.editProfileText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

        {/* Menu Links */}
        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              activeOpacity={0.7}
              onPress={() => navigation.navigate(item.route)}
            >
              <View style={styles.menuIconBox}>
                <Icon name={item.icon} size={20} color={colors.textPrimary} />
              </View>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Icon name="chevron-right" size={20} color={colors.textMuted} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutBtn}
          activeOpacity={0.7}
          onPress={() =>
            navigation.reset({
              index: 0,
              routes: [{ name: 'Welcome' as any }], 
            })
          }
        >
          <Icon name="log-out" size={20} color="#E74C3C" />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>App Version 1.0.0</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  main: { flex: 1, backgroundColor: colors.white },
  scrollContent: { padding: spacing.lg, paddingBottom: 100 },

  // User Info
  userSection: {
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: spacing.xl,
    borderRadius: radius.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
  },
  avatarContainer: { position: 'relative', marginBottom: spacing.md },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.border,
  },
  editAvatarBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.primary,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.white,
  },
  userName: { ...typography.heading, fontFamily: 'Poppins-Bold', fontSize: 22 },
  userId: { ...typography.body, color: colors.textMuted, marginTop: 2 },
  editProfileBtn: {
    marginTop: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    backgroundColor: colors.primaryLight,
  },
  editProfileText: {
    ...typography.bodyLarge,
    fontFamily: 'Poppins-SemiBold',
    color: colors.primaryDark,
  },

  // Menu List
  menuContainer: {
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
    marginBottom: spacing.lg,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.surface,
  },
  menuIconBox: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  menuLabel: {
    flex: 1,
    ...typography.bodyLarge,
    fontFamily: 'Inter_18pt-Medium',
    color: colors.textPrimary,
  },

  // Logout
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    paddingVertical: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: '#F5B7B1',
    ...shadows.card,
  },
  logoutText: {
    ...typography.bodyLarge,
    fontFamily: 'Poppins-Bold',
    color: '#E74C3C',
    marginLeft: spacing.sm,
  },

  versionText: {
    textAlign: 'center',
    ...typography.caption,
    color: colors.textMuted,
    marginTop: spacing.xl,
  },
});
