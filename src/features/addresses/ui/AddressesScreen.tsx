import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { Header } from '@/components/header';
import { colors, spacing, typography, radius, shadows } from '@/theme';

export const AddressesScreen = () => {
  const insets = useSafeAreaInsets();
  return (
    <View style={styles.main}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />
      <Header variant="standard" title="Addresses" showBack={true} useTopInset={true} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.addressCard}>
          <View style={styles.cardHeader}>
            <View style={styles.tagBadge}><Text style={styles.tagText}>Home</Text></View>
            <View style={styles.actions}><Icon name="edit-2" size={16} color={colors.primary} style={{marginRight: 12}}/><Icon name="trash-2" size={16} color="#E74C3C"/></View>
          </View>
          <Text style={styles.addressName}>Mr. J. Bala Vijai Kumar</Text>
          <Text style={styles.addressText}>124, Gason Tech Park, RS Puram, Coimbatore, Tamil Nadu 641002</Text>
          <Text style={styles.phoneText}>+91 98765 43210</Text>
        </View>
      </ScrollView>

      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, spacing.md) }]}>
        <TouchableOpacity style={styles.addBtn} activeOpacity={0.8}><Text style={styles.addText}>Add New Address</Text></TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  main: { flex: 1, backgroundColor: colors.white },
  scrollContent: { padding: spacing.lg, paddingBottom: 100 },
  addressCard: { backgroundColor: colors.white, borderRadius: radius.lg, padding: spacing.md, borderWidth: 1, borderColor: colors.border, ...shadows.card },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm },
  tagBadge: { backgroundColor: colors.primaryLight, paddingHorizontal: 12, paddingVertical: 4, borderRadius: radius.sm },
  tagText: { color: colors.primaryDark, ...typography.caption, fontFamily: 'Poppins-SemiBold' },
  actions: { flexDirection: 'row' },
  addressName: { ...typography.bodyLarge, fontFamily: 'Poppins-Bold', marginBottom: 4 },
  addressText: { ...typography.body, color: colors.textSecondary, lineHeight: 20 },
  phoneText: { ...typography.body, fontFamily: 'Inter_18pt-Medium', color: colors.textPrimary, marginTop: spacing.sm },
  bottomBar: { position: 'absolute', bottom: 0, width: '100%', backgroundColor: colors.white, padding: spacing.lg, borderTopWidth: 1, borderColor: colors.border },
  addBtn: { backgroundColor: colors.black, height: 56, borderRadius: radius.xl, alignItems: 'center', justifyContent: 'center' },
  addText: { ...typography.buttonPrimary, fontSize: 16 },
});