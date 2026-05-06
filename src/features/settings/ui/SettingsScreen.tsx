import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Switch, 
  StatusBar 
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { Header } from '@/components/header';
import { colors, spacing, typography, radius, shadows } from '@/theme';

export const SettingsScreen = () => {
  // Toggle States
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [locationEnabled, setLocationEnabled] = useState(true);
  const [biometricsEnabled, setBiometricsEnabled] = useState(true);

  return (
    <View style={styles.main}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />
      
      <Header 
        variant="standard" 
        title="Settings" 
        showBack={true} 
        useTopInset={true}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* --- Preferences Group --- */}
        <Text style={styles.groupTitle}>Preferences</Text>
        <View style={styles.settingsGroup}>
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Icon name="bell" size={20} color={colors.textPrimary} style={styles.icon} />
              <Text style={styles.settingLabel}>Push Notifications</Text>
            </View>
            <Switch
              value={pushEnabled}
              onValueChange={setPushEnabled}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.white}
            />
          </View>
          
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Icon name="mail" size={20} color={colors.textPrimary} style={styles.icon} />
              <Text style={styles.settingLabel}>Email Promos & Offers</Text>
            </View>
            <Switch
              value={emailEnabled}
              onValueChange={setEmailEnabled}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.white}
            />
          </View>

          <View style={[styles.settingRow, styles.lastRow]}>
            <View style={styles.settingLeft}>
              <Icon name="map-pin" size={20} color={colors.textPrimary} style={styles.icon} />
              <Text style={styles.settingLabel}>Location Services</Text>
            </View>
            <Switch
              value={locationEnabled}
              onValueChange={setLocationEnabled}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.white}
            />
          </View>
        </View>

        {/* --- Security Group --- */}
        <Text style={styles.groupTitle}>Security</Text>
        <View style={styles.settingsGroup}>
          <TouchableOpacity style={styles.settingRow} activeOpacity={0.7}>
            <View style={styles.settingLeft}>
              <Icon name="lock" size={20} color={colors.textPrimary} style={styles.icon} />
              <Text style={styles.settingLabel}>Change Password</Text>
            </View>
            <Icon name="chevron-right" size={20} color={colors.textMuted} />
          </TouchableOpacity>
          
          <View style={[styles.settingRow, styles.lastRow]}>
            <View style={styles.settingLeft}>
              <Icon name="user-check" size={20} color={colors.textPrimary} style={styles.icon} />
              <Text style={styles.settingLabel}>Face ID / Biometrics</Text>
            </View>
            <Switch
              value={biometricsEnabled}
              onValueChange={setBiometricsEnabled}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.white}
            />
          </View>
        </View>

        {/* --- About Group --- */}
        <Text style={styles.groupTitle}>About</Text>
        <View style={styles.settingsGroup}>
          <TouchableOpacity style={styles.settingRow} activeOpacity={0.7}>
            <View style={styles.settingLeft}>
              <Icon name="file-text" size={20} color={colors.textPrimary} style={styles.icon} />
              <Text style={styles.settingLabel}>Terms of Service</Text>
            </View>
            <Icon name="chevron-right" size={20} color={colors.textMuted} />
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.settingRow, styles.lastRow]} activeOpacity={0.7}>
            <View style={styles.settingLeft}>
              <Icon name="shield" size={20} color={colors.textPrimary} style={styles.icon} />
              <Text style={styles.settingLabel}>Privacy Policy</Text>
            </View>
            <Icon name="chevron-right" size={20} color={colors.textMuted} />
          </TouchableOpacity>
        </View>

        {/* --- Danger Zone --- */}
        <Text style={[styles.groupTitle, { color: '#E74C3C' }]}>Danger Zone</Text>
        <View style={[styles.settingsGroup, { borderColor: '#F5B7B1' }]}>
          <TouchableOpacity style={[styles.settingRow, styles.lastRow]} activeOpacity={0.7}>
            <View style={styles.settingLeft}>
              <Icon name="trash-2" size={20} color="#E74C3C" style={styles.icon} />
              <Text style={[styles.settingLabel, { color: '#E74C3C', fontFamily: 'Poppins-SemiBold' }]}>Delete Account</Text>
            </View>
            <Icon name="chevron-right" size={20} color="#F5B7B1" />
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  main: { flex: 1, backgroundColor: colors.white },
  scrollContent: { padding: spacing.lg, paddingBottom: 60 },
  
  groupTitle: { 
    ...typography.bodyLarge, 
    fontFamily: 'Poppins-Bold', 
    color: colors.textSecondary, 
    marginBottom: spacing.sm,
    marginLeft: spacing.xs,
    marginTop: spacing.md 
  },
  
  settingsGroup: { 
    backgroundColor: colors.white, 
    borderRadius: radius.lg, 
    borderWidth: 1, 
    borderColor: colors.border, 
    paddingHorizontal: spacing.md, 
    marginBottom: spacing.lg,
    ...shadows.card,
    shadowOpacity: 0.04
  },
  
  settingRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingVertical: spacing.md, 
    borderBottomWidth: 1, 
    borderBottomColor: colors.surface 
  },
  
  lastRow: { 
    borderBottomWidth: 0 
  },
  
  settingLeft: { 
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  
  icon: { 
    marginRight: spacing.md 
  },
  
  settingLabel: { 
    ...typography.bodyLarge, 
    fontFamily: 'Inter_18pt-Medium', 
    color: colors.textPrimary 
  },
});