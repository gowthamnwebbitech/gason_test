import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { Header } from '@/components/header';
import { colors, spacing, typography, radius, shadows } from '@/theme';

const dummyNotifications = [
  { id: '1', type: 'order', title: 'Order Delivered!', message: 'Your Gas Stove order has been delivered successfully.', time: '2 hours ago', isNew: true, icon: 'package', color: '#2ECC71' },
  { id: '2', type: 'promo', title: 'Special Discount 🎁', message: 'Get 20% off on your next pipeline survey booking.', time: 'Yesterday', isNew: true, icon: 'tag', color: '#F39C12' },
  { id: '3', type: 'alert', title: 'Security Alert', message: 'New login detected from Chrome on Windows.', time: '2 days ago', isNew: false, icon: 'shield', color: '#E74C3C' },
  { id: '4', type: 'order', title: 'Order Confirmed', message: 'Your order ORD-1092 has been confirmed and is being packed.', time: '3 days ago', isNew: false, icon: 'check-circle', color: colors.primary },
];

export const NotificationsScreen = () => {
  return (
    <View style={styles.main}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />
      
      {/* Header with "Mark all as read" icon */}
      <Header variant="standard" title="Notifications" showBack={true} rightIcon="check-square" useTopInset={true} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {dummyNotifications.map((notif) => (
          <TouchableOpacity 
            key={notif.id} 
            style={[styles.notificationCard, notif.isNew && styles.unreadCard]} 
            activeOpacity={0.7}
          >
            {/* Icon Box */}
            <View style={[styles.iconBox, { backgroundColor: notif.color + '15' }]}>
              <Icon name={notif.icon} size={20} color={notif.color} />
            </View>

            {/* Content */}
            <View style={styles.contentBox}>
              <View style={styles.titleRow}>
                <Text style={[styles.title, notif.isNew && styles.unreadText]}>{notif.title}</Text>
                {notif.isNew && <View style={styles.newDot} />}
              </View>
              <Text style={styles.message} numberOfLines={2}>{notif.message}</Text>
              <Text style={styles.timeText}>{notif.time}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  main: { flex: 1, backgroundColor: colors.surface }, // Light gray bg to make white cards pop
  scrollContent: { padding: spacing.lg, paddingBottom: 100 },
  
  notificationCard: { 
    flexDirection: 'row', 
    backgroundColor: colors.white, 
    padding: spacing.md, 
    borderRadius: radius.lg, 
    marginBottom: spacing.md, 
    borderWidth: 1, 
    borderColor: colors.border,
    ...shadows.card 
  },
  unreadCard: { 
    borderColor: colors.primaryLight,
    backgroundColor: '#F5FCF9' // Very slight green tint
  },
  
  iconBox: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginRight: spacing.md },
  
  contentBox: { flex: 1, justifyContent: 'center' },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  title: { ...typography.bodyLarge, fontFamily: 'Inter_18pt-Medium', color: colors.textPrimary },
  unreadText: { fontFamily: 'Poppins-Bold' },
  newDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary },
  
  message: { ...typography.caption, color: colors.textSecondary, lineHeight: 18, marginBottom: spacing.xs },
  timeText: { ...typography.caption, fontSize: 10, color: colors.textMuted, fontFamily: 'Poppins-SemiBold' },
});