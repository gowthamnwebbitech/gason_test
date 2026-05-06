import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { Header } from '@/components/header';
import { colors, spacing, typography, radius, shadows } from '@/theme';

export const SupportScreen = () => {
  return (
    <View style={styles.main}>
      <StatusBar barStyle="dark-content" translucent={true} />
      <Header variant="standard" title="Help & Support" showBack={true} useTopInset={true} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <Text style={styles.heroText}>How can we help you today?</Text>

        <TouchableOpacity style={styles.supportCard}>
          <View style={[styles.iconBox, {backgroundColor: '#E74C3C15'}]}><Icon name="phone-call" size={24} color="#E74C3C" /></View>
          <View style={styles.cardInfo}><Text style={styles.cardTitle}>Call Us</Text><Text style={styles.cardDesc}>Available 24/7 for emergencies</Text></View>
          <Icon name="chevron-right" size={20} color={colors.textMuted}/>
        </TouchableOpacity>

        <TouchableOpacity style={styles.supportCard}>
          <View style={[styles.iconBox, {backgroundColor: colors.primaryLight}]}><Icon name="message-circle" size={24} color={colors.primary} /></View>
          <View style={styles.cardInfo}><Text style={styles.cardTitle}>Live Chat</Text><Text style={styles.cardDesc}>Chat with our support agents</Text></View>
          <Icon name="chevron-right" size={20} color={colors.textMuted}/>
        </TouchableOpacity>

        <TouchableOpacity style={styles.supportCard}>
          <View style={[styles.iconBox, {backgroundColor: '#3498DB15'}]}><Icon name="mail" size={24} color="#3498DB" /></View>
          <View style={styles.cardInfo}><Text style={styles.cardTitle}>Email Support</Text><Text style={styles.cardDesc}>support@gason.in</Text></View>
          <Icon name="chevron-right" size={20} color={colors.textMuted}/>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  main: { flex: 1, backgroundColor: colors.white },
  scrollContent: { padding: spacing.lg },
  heroText: { ...typography.heading, fontFamily: 'Poppins-Bold', fontSize: 24, marginBottom: spacing.xl },
  supportCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white, padding: spacing.md, borderRadius: radius.lg, marginBottom: spacing.md, borderWidth: 1, borderColor: colors.border, ...shadows.card },
  iconBox: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginRight: spacing.md },
  cardInfo: { flex: 1 },
  cardTitle: { ...typography.bodyLarge, fontFamily: 'Poppins-Bold' },
  cardDesc: { ...typography.caption, color: colors.textSecondary, marginTop: 2 }
});