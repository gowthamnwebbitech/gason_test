import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { Header } from '@/components/header';
import { colors, spacing, typography, radius, shadows } from '@/theme';

export const EmergencyScreen = () => {
  const insets = useSafeAreaInsets();
  const [sosMessage, setSosMessage] = useState('');

  return (
    <View style={styles.main}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />
      
      {/* Emergency Header */}
      <Header 
        variant="standard" 
        title="Emergency Assist" 
        showBack={true} 
        useTopInset={true} 
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* --- Critical Alert Box --- */}
        <View style={styles.alertBox}>
          <Icon name="alert-triangle" size={36} color="#E74C3C" style={{ marginBottom: spacing.sm }} />
          <Text style={styles.alertTitle}>Are you smelling gas?</Text>
          <Text style={styles.alertDesc}>
            Turn off the main cylinder regulator immediately. Open all doors and windows. Do not use electrical switches or lighters.
          </Text>
        </View>

        {/* --- Quick Contact Cards --- */}
        <Text style={styles.sectionTitle}>Emergency Contacts</Text>
        
        <TouchableOpacity style={styles.contactCardPrimary} activeOpacity={0.8}>
          <View style={styles.contactIconBoxPrimary}>
            <Icon name="phone-call" size={24} color={colors.white} />
          </View>
          <View style={styles.contactInfo}>
            <Text style={styles.contactName}>National Gas Helpline</Text>
            <Text style={styles.contactNumber}>1906</Text>
          </View>
          <Icon name="chevron-right" size={20} color="#E74C3C" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.contactCardSecondary} activeOpacity={0.8}>
          <View style={styles.contactIconBoxSecondary}>
            <Icon name="headphones" size={24} color={colors.white} />
          </View>
          <View style={styles.contactInfo}>
            <Text style={styles.contactName}>Gason Rapid Response Team</Text>
            <Text style={styles.contactNumber}>1800-456-7890</Text>
          </View>
          <Icon name="chevron-right" size={20} color={colors.textMuted} />
        </TouchableOpacity>

        {/* --- Direct SOS Message Form --- */}
        <View style={{ marginTop: spacing.xl }}>
          <Text style={styles.sectionTitle}>Send Urgent SOS Message</Text>
          <Text style={styles.inputDesc}>
            We will dispatch an emergency team to your registered address immediately.
          </Text>

          <View style={styles.inputContainer}>
            <TextInput 
              style={styles.textArea}
              placeholder="Describe the emergency quickly (e.g., Broken valve, heavy smell in kitchen)..."
              placeholderTextColor={colors.textMuted}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              value={sosMessage}
              onChangeText={setSosMessage}
            />
          </View>
        </View>

      </ScrollView>

      {/* --- Sticky SOS Action Bar --- */}
      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, spacing.md) }]}>
        <TouchableOpacity style={styles.sosBtn} activeOpacity={0.8}>
          <Text style={styles.sosText}>Send SOS Alert</Text>
          <Icon name="send" size={20} color={colors.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  main: { flex: 1, backgroundColor: colors.white },
  scrollContent: { padding: spacing.lg, paddingBottom: 120 }, // Extra padding for the sticky bottom bar
  
  // Alert Box
  alertBox: { 
    backgroundColor: '#FDEDEC', 
    borderWidth: 1, 
    borderColor: '#F5B7B1', 
    borderRadius: radius.lg, 
    padding: spacing.xl, 
    alignItems: 'center', 
    marginBottom: spacing.xl 
  },
  alertTitle: { ...typography.heading, fontFamily: 'Poppins-Bold', color: '#E74C3C', marginBottom: spacing.xs },
  alertDesc: { ...typography.body, color: '#C0392B', textAlign: 'center', lineHeight: 22 },

  sectionTitle: { ...typography.bodyLarge, fontFamily: 'Poppins-Bold', marginBottom: spacing.md, color: colors.textPrimary },
  
  // Contact Cards
  contactCardPrimary: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#FFF5F5', 
    borderRadius: radius.lg, 
    borderWidth: 2, 
    borderColor: '#E74C3C', 
    padding: spacing.md, 
    marginBottom: spacing.md, 
    ...shadows.card 
  },
  contactIconBoxPrimary: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#E74C3C', alignItems: 'center', justifyContent: 'center', marginRight: spacing.md },
  
  contactCardSecondary: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: colors.white, 
    borderRadius: radius.lg, 
    borderWidth: 1, 
    borderColor: colors.border, 
    padding: spacing.md, 
    ...shadows.card 
  },
  contactIconBoxSecondary: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.black, alignItems: 'center', justifyContent: 'center', marginRight: spacing.md },
  
  contactInfo: { flex: 1 },
  contactName: { ...typography.caption, color: colors.textSecondary },
  contactNumber: { ...typography.heading, fontSize: 18, fontFamily: 'Poppins-Bold', color: colors.textPrimary, marginTop: 2 },

  // Message Form
  inputDesc: { ...typography.caption, color: colors.textMuted, marginBottom: spacing.md },
  inputContainer: { marginBottom: spacing.lg },
  textArea: { 
    backgroundColor: colors.surface, 
    borderWidth: 1, 
    borderColor: '#F5B7B1', // Soft red border to indicate urgency
    borderRadius: radius.md, 
    padding: spacing.md, 
    height: 120, 
    color: colors.textPrimary, 
    ...typography.bodyLarge 
  },

  // Bottom Action Bar
  bottomBar: { 
    position: 'absolute', 
    bottom: 0, 
    left: 0, 
    right: 0, 
    backgroundColor: colors.white, 
    paddingHorizontal: spacing.lg, 
    paddingTop: spacing.md, 
    borderTopWidth: 1, 
    borderTopColor: colors.border, 
    ...shadows.card 
  },
  sosBtn: { 
    flexDirection: 'row', 
    backgroundColor: '#E74C3C', // Urgent Red
    height: 56, 
    borderRadius: radius.xl, 
    alignItems: 'center', 
    justifyContent: 'center', 
    ...shadows.card, 
    shadowColor: '#E74C3C' 
  },
  sosText: { ...typography.buttonPrimary, fontSize: 18, marginRight: spacing.sm },
});