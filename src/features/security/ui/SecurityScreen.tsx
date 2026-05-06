import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { Header } from '@/components/header';
import { colors, spacing, typography, radius, shadows } from '@/theme';

export const SecurityScreen = () => {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [biometricsEnabled, setBiometricsEnabled] = useState(true);

  return (
    <View style={styles.main}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />
      <Header variant="standard" title="Security & Privacy" showBack={true} useTopInset={true} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* --- Login Security --- */}
        <Text style={styles.sectionTitle}>Login Security</Text>
        <View style={styles.cardGroup}>
          <TouchableOpacity style={styles.rowItem} activeOpacity={0.7}>
            <View style={styles.rowLeft}>
              <View style={styles.iconBox}><Icon name="lock" size={18} color={colors.textPrimary} /></View>
              <Text style={styles.rowLabel}>Change Password</Text>
            </View>
            <Icon name="chevron-right" size={20} color={colors.textMuted} />
          </TouchableOpacity>

          <View style={styles.divider} />

          <View style={styles.rowItem}>
            <View style={styles.rowLeft}>
              <View style={styles.iconBox}><Icon name="smartphone" size={18} color={colors.textPrimary} /></View>
              <View>
                <Text style={styles.rowLabel}>Two-Factor Authentication</Text>
                <Text style={styles.rowSubLabel}>Adds an extra layer of security</Text>
              </View>
            </View>
            <Switch
              value={twoFactorEnabled}
              onValueChange={setTwoFactorEnabled}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.white}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.rowItem}>
            <View style={styles.rowLeft}>
              <View style={styles.iconBox}><Icon name="eye" size={18} color={colors.textPrimary} /></View>
              <Text style={styles.rowLabel}>Enable Face ID / Touch ID</Text>
            </View>
            <Switch
              value={biometricsEnabled}
              onValueChange={setBiometricsEnabled}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.white}
            />
          </View>
        </View>

        {/* --- Active Devices --- */}
        <Text style={styles.sectionTitle}>Active Devices</Text>
        <View style={styles.cardGroup}>
          <View style={styles.deviceRow}>
            <Icon name="smartphone" size={24} color={colors.primary} style={styles.deviceIcon} />
            <View style={styles.deviceInfo}>
              <Text style={styles.deviceName}>iPhone 14 Pro Max</Text>
              <Text style={styles.deviceStatus}>Active Now • Coimbatore</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.deviceRow}>
            <Icon name="monitor" size={24} color={colors.textMuted} style={styles.deviceIcon} />
            <View style={styles.deviceInfo}>
              <Text style={styles.deviceName}>MacBook Air M2</Text>
              <Text style={styles.deviceStatus}>Last active 2 hours ago</Text>
            </View>
            <TouchableOpacity><Text style={styles.logoutText}>Log Out</Text></TouchableOpacity>
          </View>
        </View>

        {/* --- Privacy & Data --- */}
        <Text style={styles.sectionTitle}>Privacy & Data</Text>
        <View style={styles.cardGroup}>
          <TouchableOpacity style={styles.rowItem} activeOpacity={0.7}>
            <View style={styles.rowLeft}>
              <View style={styles.iconBox}><Icon name="download-cloud" size={18} color={colors.textPrimary} /></View>
              <Text style={styles.rowLabel}>Request My Data</Text>
            </View>
            <Icon name="chevron-right" size={20} color={colors.textMuted} />
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  main: { flex: 1, backgroundColor: colors.surface },
  scrollContent: { padding: spacing.lg, paddingBottom: 60 },
  
  sectionTitle: { ...typography.bodyLarge, fontFamily: 'Poppins-Bold', color: colors.textSecondary, marginBottom: spacing.sm, marginLeft: spacing.xs, marginTop: spacing.md },
  
  cardGroup: { backgroundColor: colors.white, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, paddingHorizontal: spacing.md, marginBottom: spacing.lg, ...shadows.card },
  divider: { height: 1, backgroundColor: colors.surface },
  
  // Row Items
  rowItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: spacing.md },
  rowLeft: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  iconBox: { width: 36, height: 36, borderRadius: radius.md, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', marginRight: spacing.md },
  rowLabel: { ...typography.bodyLarge, fontFamily: 'Inter_18pt-Medium', color: colors.textPrimary },
  rowSubLabel: { ...typography.caption, color: colors.textMuted, marginTop: 2 },
  
  // Device Rows
  deviceRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.md },
  deviceIcon: { marginRight: spacing.md },
  deviceInfo: { flex: 1 },
  deviceName: { ...typography.bodyLarge, fontFamily: 'Poppins-SemiBold', color: colors.textPrimary },
  deviceStatus: { ...typography.caption, color: colors.textMuted, marginTop: 2 },
  logoutText: { ...typography.body, fontFamily: 'Poppins-SemiBold', color: '#E74C3C' },
});