import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { colors, spacing, typography, radius, shadows } from '@/theme';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '@/navigation/types';

type SuccessScreenNavigationProp = NativeStackNavigationProp<
  AppStackParamList,
  'checkoutSuccess'
>;

interface Props {
  navigation: SuccessScreenNavigationProp;
}

export const SuccessScreen = ({ navigation }: Props) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.main, { paddingTop: insets.top }]}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent={true}
      />

      <View style={styles.content}>
        {/* --- Success Icon --- */}
        <View style={styles.iconWrapper}>
          <View style={styles.iconCircle}>
            <Icon name="check" size={48} color={colors.white} />
          </View>
        </View>

        {/* --- Thank You Text --- */}
        <Text style={styles.title}>Order Confirmed!</Text>
        <Text style={styles.subtitle}>
          Thank you for your purchase. Your order has been placed successfully
          and is being processed.
        </Text>

        {/* --- Order Details Card --- */}
        <View style={styles.orderCard}>
          <View style={styles.orderRow}>
            <Text style={styles.orderLabel}>Order ID</Text>
            <Text style={styles.orderValue}>ORD-1093</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.orderRow}>
            <Text style={styles.orderLabel}>Date</Text>
            <Text style={styles.orderValue}>05 May, 2026</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.orderRow}>
            <Text style={styles.orderLabel}>Total Amount</Text>
            <Text
              style={[
                styles.orderValue,
                { color: colors.primary, fontSize: 18 },
              ]}
            >
              ₹3,550
            </Text>
          </View>
        </View>
      </View>

      {/* --- Action Buttons --- */}
      <View
        style={[
          styles.bottomActions,
          { paddingBottom: Math.max(insets.bottom, spacing.lg) },
        ]}
      >
        <TouchableOpacity
          style={styles.primaryBtn}
          activeOpacity={0.8}
          // Navigate to the Delivery/Tracking screen
          onPress={() => navigation.navigate('Delivery')}
        >
          <Text style={styles.primaryBtnText}>Track Order</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryBtn}
          activeOpacity={0.7}
          // Navigate back to the Home tab
          onPress={() =>
            navigation.navigate('MainTabs', { screen: 'Products' } as any)
          }
        >
          <Text style={styles.secondaryBtnText}>Continue Shopping</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  main: { flex: 1, backgroundColor: colors.white },

  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },

  // Icon Styles
  iconWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.card,
    shadowColor: colors.primary,
  },

  // Typography
  title: {
    ...typography.heading,
    fontFamily: 'Poppins-Bold',
    fontSize: 28,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.xxl,
  },

  // Order Details Card
  orderCard: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  orderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.sm,
  },
  orderLabel: {
    ...typography.body,
    color: colors.textSecondary,
  },
  orderValue: {
    ...typography.bodyLarge,
    fontFamily: 'Poppins-SemiBold',
    color: colors.textPrimary,
  },

  // Action Buttons
  bottomActions: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  primaryBtn: {
    backgroundColor: colors.black,
    height: 56,
    borderRadius: radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    ...shadows.card,
  },
  primaryBtnText: {
    ...typography.buttonPrimary,
    fontSize: 16,
  },
  secondaryBtn: {
    height: 56,
    borderRadius: radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  secondaryBtnText: {
    ...typography.buttonSecondary,
    fontFamily: 'Poppins-SemiBold',
    color: colors.textPrimary,
  },
});
