import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, StatusBar, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { Header } from '@/components/header';
import { colors, spacing, typography, radius, shadows } from '@/theme';

const dummyOrders = [
  { id: 'ORD-1092', date: '24 Oct, 2026', items: 2, total: '₹3,250', status: 'Delivered', color: '#2ECC71' },
  { id: 'ORD-1091', date: '10 Sep, 2026', items: 1, total: '₹1,100', status: 'Processing', color: '#F39C12' },
];

export const OrdersScreen = () => {
  const renderOrder = ({ item }: any) => (
    <TouchableOpacity style={styles.orderCard} activeOpacity={0.8}>
      <View style={styles.orderHeader}>
        <View>
          <Text style={styles.orderId}>{item.id}</Text>
          <Text style={styles.orderDate}>{item.date}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: item.color + '20' }]}>
          <Text style={[styles.statusText, { color: item.color }]}>{item.status}</Text>
        </View>
      </View>
      <View style={styles.divider} />
      <View style={styles.orderFooter}>
        <Text style={styles.orderDesc}>{item.items} Items • {item.total}</Text>
        <Icon name="chevron-right" size={20} color={colors.textMuted} />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.main}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />
      <Header variant="standard" title="My Orders" showBack={true} useTopInset={true} />
      <FlatList data={dummyOrders} keyExtractor={(i) => i.id} renderItem={renderOrder} contentContainerStyle={styles.listContent} showsVerticalScrollIndicator={false} />
    </View>
  );
};

const styles = StyleSheet.create({
  main: { flex: 1, backgroundColor: colors.surface }, // Surface bg highlights the white cards
  listContent: { padding: spacing.lg },
  orderCard: { backgroundColor: colors.white, borderRadius: radius.lg, padding: spacing.md, marginBottom: spacing.md, borderWidth: 1, borderColor: colors.border, ...shadows.card },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  orderId: { ...typography.bodyLarge, fontFamily: 'Poppins-Bold' },
  orderDate: { ...typography.caption, color: colors.textSecondary, marginTop: 2 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.full },
  statusText: { ...typography.caption, fontFamily: 'Poppins-SemiBold' },
  divider: { height: 1, backgroundColor: colors.surface, marginVertical: spacing.sm },
  orderFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  orderDesc: { ...typography.body, fontFamily: 'Inter_18pt-Medium', color: colors.textPrimary },
});