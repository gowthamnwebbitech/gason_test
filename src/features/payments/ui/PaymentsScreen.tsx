import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { Header } from '@/components/header';
import { colors, spacing, typography, radius, shadows } from '@/theme';

export const PaymentsScreen = () => {
  return (
    <View style={styles.main}>
      <StatusBar barStyle="dark-content" translucent={true} />
      <Header variant="standard" title="Payments" showBack={true} useTopInset={true} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <Text style={styles.sectionTitle}>Saved Cards</Text>
        <TouchableOpacity style={styles.cardItem}>
          <View style={styles.cardIconBox}><Icon name="credit-card" size={20} color={colors.primary} /></View>
          <View style={{flex: 1}}><Text style={styles.cardName}>HDFC Bank Credit Card</Text><Text style={styles.cardNum}>**** **** **** 4242</Text></View>
          <Icon name="trash-2" size={18} color={colors.textMuted} />
        </TouchableOpacity>

        <Text style={[styles.sectionTitle, {marginTop: spacing.xl}]}>UPI Apps</Text>
        <TouchableOpacity style={styles.cardItem}>
          <View style={styles.cardIconBox}><Icon name="smartphone" size={20} color={colors.primary} /></View>
          <View style={{flex: 1}}><Text style={styles.cardName}>Google Pay</Text><Text style={styles.cardNum}>balavijai@okaxis</Text></View>
          <Icon name="trash-2" size={18} color={colors.textMuted} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.addNewBtn}><Icon name="plus" size={18} color={colors.primary} /><Text style={styles.addNewText}>Add New Payment Method</Text></TouchableOpacity>
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  main: { flex: 1, backgroundColor: colors.surface },
  scrollContent: { padding: spacing.lg },
  sectionTitle: { ...typography.bodyLarge, fontFamily: 'Poppins-Bold', marginBottom: spacing.md, color: colors.textPrimary },
  cardItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white, padding: spacing.md, borderRadius: radius.lg, marginBottom: spacing.md, borderWidth: 1, borderColor: colors.border, ...shadows.card },
  cardIconBox: { width: 40, height: 40, borderRadius: radius.md, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center', marginRight: spacing.md },
  cardName: { ...typography.bodyLarge, fontFamily: 'Inter_18pt-Medium' },
  cardNum: { ...typography.caption, color: colors.textSecondary },
  addNewBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: spacing.md, backgroundColor: colors.primaryLight, borderRadius: radius.lg, marginTop: spacing.md, borderWidth: 1, borderColor: colors.primary, borderStyle: 'dashed' },
  addNewText: { ...typography.bodyLarge, fontFamily: 'Poppins-SemiBold', color: colors.primary, marginLeft: spacing.sm }
});