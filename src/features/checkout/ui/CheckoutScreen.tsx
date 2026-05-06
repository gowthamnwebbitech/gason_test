import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { Header } from '@/components/header';
import { colors, spacing, typography, radius, shadows } from '@/theme';

// --- Dummy Data ---
const orderItems = [
  { id: '1', image: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?q=80&w=200&auto=format&fit=crop', qty: 1 },
  { id: '2', image: 'https://images.unsplash.com/photo-1644342531398-e7c653630f9a?q=80&w=200&auto=format&fit=crop', qty: 2 },
];

const paymentMethods = [
  { id: 'upi', name: 'UPI / Net Banking', icon: 'smartphone' },
  { id: 'card', name: 'Credit / Debit Card', icon: 'credit-card' },
  { id: 'cod', name: 'Cash on Delivery', icon: 'truck' },
];

export const CheckoutScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const [selectedPayment, setSelectedPayment] = useState('upi');

  // Dummy totals
  const subtotal = 3500;
  const deliveryFee = 50;
  const total = subtotal + deliveryFee;

  return (
    <View style={styles.main}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />
      
      <Header 
        variant="standard" 
        title="Checkout" 
        showBack={true} 
        useTopInset={true}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* --- Shipping Address Section --- */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Shipping Address</Text>
        </View>
        
        <View style={styles.addressCard}>
          <View style={styles.addressIconBox}>
            <Icon name="map-pin" size={20} color={colors.white} />
          </View>
          <View style={styles.addressInfo}>
            <Text style={styles.addressName}>Mr. J. Bala Vijai Kumar</Text>
            <Text style={styles.addressText}>124, Gason Tech Park, RS Puram</Text>
            <Text style={styles.addressText}>Coimbatore, Tamil Nadu 641002</Text>
            <Text style={styles.addressPhone}>+91 98765 43210</Text>
          </View>
          <TouchableOpacity style={styles.editBtn} activeOpacity={0.7}>
            <Icon name="edit-2" size={18} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* --- Order Summary (Compact) --- */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.orderPreviewScroll}>
          {orderItems.map((item) => (
            <View key={item.id} style={styles.previewImageContainer}>
              <Image source={{ uri: item.image }} style={styles.previewImage} />
              <View style={styles.qtyBadge}>
                <Text style={styles.qtyBadgeText}>{item.qty}</Text>
              </View>
            </View>
          ))}
          <TouchableOpacity style={styles.viewAllItemsBtn}>
            <Text style={styles.viewAllItemsText}>View Details</Text>
            <Icon name="chevron-right" size={16} color={colors.textSecondary} />
          </TouchableOpacity>
        </ScrollView>

        {/* --- Payment Method Section --- */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
        </View>
        
        <View style={styles.paymentContainer}>
          {paymentMethods.map((method) => {
            const isSelected = selectedPayment === method.id;
            return (
              <TouchableOpacity
                key={method.id}
                activeOpacity={0.8}
                onPress={() => setSelectedPayment(method.id)}
                style={[
                  styles.paymentCard,
                  isSelected && styles.paymentCardSelected
                ]}
              >
                <View style={styles.paymentLeft}>
                  <View style={[styles.paymentIconBox, isSelected && styles.paymentIconBoxSelected]}>
                    <Icon name={method.icon} size={20} color={isSelected ? colors.primary : colors.textMuted} />
                  </View>
                  <Text style={[styles.paymentName, isSelected && styles.paymentNameSelected]}>
                    {method.name}
                  </Text>
                </View>
                
                {/* Custom Radio Button */}
                <View style={[styles.radioOuter, isSelected && styles.radioOuterSelected]}>
                  {isSelected && <View style={styles.radioInner} />}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* --- Price Breakdown --- */}
        <View style={styles.priceBreakdownCard}>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Subtotal</Text>
            <Text style={styles.priceValue}>₹{subtotal.toLocaleString()}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Delivery Fee</Text>
            <Text style={styles.priceValue}>₹{deliveryFee.toLocaleString()}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.priceRow}>
            <Text style={styles.totalLabel}>Total Payment</Text>
            <Text style={styles.totalValue}>₹{total.toLocaleString()}</Text>
          </View>
        </View>

      </ScrollView>

      {/* --- Sticky Footer --- */}
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, spacing.md) }]}>
        <View style={styles.footerTextContainer}>
          <Text style={styles.footerLabel}>Total</Text>
          <Text style={styles.footerTotal}>₹{total.toLocaleString()}</Text>
        </View>
        <TouchableOpacity 
          style={styles.placeOrderBtn} 
          activeOpacity={0.8}
          onPress={() => navigation.navigate('Success')} // Assuming you have a Success screen in AuthStack/AppStack
        >
          <Text style={styles.placeOrderText}>Place Order</Text>
          <Icon name="check-circle" size={20} color={colors.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  main: { flex: 1, backgroundColor: colors.white },
  scrollContent: { padding: spacing.lg, paddingBottom: 120 },
  
  sectionHeader: { marginBottom: spacing.sm, marginTop: spacing.md },
  sectionTitle: { ...typography.heading, fontFamily: 'Poppins-Bold', fontSize: 18 },

  // Address Card
  addressCard: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
    alignItems: 'flex-start',
  },
  addressIconBox: { width: 40, height: 40, borderRadius: radius.full, backgroundColor: colors.black, alignItems: 'center', justifyContent: 'center', marginRight: spacing.md },
  addressInfo: { flex: 1 },
  addressName: { ...typography.bodyLarge, fontFamily: 'Poppins-Bold', marginBottom: 2 },
  addressText: { ...typography.caption, color: colors.textSecondary, lineHeight: 18 },
  addressPhone: { ...typography.caption, fontFamily: 'Inter_18pt-Medium', color: colors.textPrimary, marginTop: spacing.xs },
  editBtn: { padding: spacing.xs },

  // Order Preview
  orderPreviewScroll: { paddingVertical: spacing.sm, gap: spacing.md, alignItems: 'center' },
  previewImageContainer: { position: 'relative', width: 64, height: 64, borderRadius: radius.md, backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  previewImage: { width: '100%', height: '100%', borderRadius: radius.md },
  qtyBadge: { position: 'absolute', top: -8, right: -8, backgroundColor: colors.black, width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: colors.white },
  qtyBadgeText: { color: colors.white, fontSize: 10, fontFamily: 'Poppins-Bold' },
  viewAllItemsBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.md, height: 64 },
  viewAllItemsText: { ...typography.body, color: colors.textSecondary, marginRight: 4, fontFamily: 'Inter_18pt-Medium' },

  // Payment Methods
  paymentContainer: { gap: spacing.sm },
  paymentCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: spacing.md, backgroundColor: colors.white, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, ...shadows.card, shadowOpacity: 0.03 },
  paymentCardSelected: { borderColor: colors.primary, backgroundColor: colors.primaryLight },
  paymentLeft: { flexDirection: 'row', alignItems: 'center' },
  paymentIconBox: { width: 40, height: 40, borderRadius: radius.md, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', marginRight: spacing.md },
  paymentIconBoxSelected: { backgroundColor: colors.white },
  paymentName: { ...typography.bodyLarge, fontFamily: 'Inter_18pt-Medium', color: colors.textSecondary },
  paymentNameSelected: { color: colors.textPrimary, fontFamily: 'Poppins-SemiBold' },
  radioOuter: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  radioOuterSelected: { borderColor: colors.primary },
  radioInner: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary },

  // Price Breakdown
  priceBreakdownCard: { marginTop: spacing.xl, padding: spacing.md, backgroundColor: colors.surface, borderRadius: radius.lg },
  priceRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm },
  priceLabel: { ...typography.body, color: colors.textSecondary },
  priceValue: { ...typography.bodyLarge, fontFamily: 'Inter_18pt-Medium', color: colors.textPrimary },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: spacing.sm },
  totalLabel: { ...typography.bodyLarge, fontFamily: 'Poppins-Bold' },
  totalValue: { ...typography.heading, fontSize: 18, color: colors.primary },

  // Footer
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: colors.white, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingTop: spacing.md, borderTopWidth: 1, borderTopColor: colors.border, ...shadows.card, shadowOffset: { width: 0, height: -4 } },
  footerTextContainer: { flex: 1 },
  footerLabel: { ...typography.caption, color: colors.textMuted, textTransform: 'uppercase' },
  footerTotal: { ...typography.heading, fontFamily: 'Poppins-Bold', fontSize: 24, color: colors.textPrimary },
  placeOrderBtn: { flex: 1.5, flexDirection: 'row', backgroundColor: colors.black, height: 56, borderRadius: radius.xl, alignItems: 'center', justifyContent: 'center', ...shadows.card },
  placeOrderText: { ...typography.buttonPrimary, fontSize: 16, marginRight: spacing.sm },
});