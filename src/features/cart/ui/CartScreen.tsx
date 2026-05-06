import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppStackParamList } from '@/navigation/types'; // Make sure this path is correct
import { Header } from '@/components/header';
import { colors, spacing, typography, radius, shadows } from '@/theme';

const initialCart = [
  { id: '1', name: 'Premium Gas Stove', price: 3000, quantity: 1, image: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?q=80&w=500&auto=format&fit=crop' },
  { id: '2', name: 'Flexible Hose Pipe 2m', price: 250, quantity: 2, image: 'https://images.unsplash.com/photo-1644342531398-e7c653630f9a?q=80&w=500&auto=format&fit=crop' },
];

// Add typing for navigation
type CartScreenNavigationProp = NativeStackNavigationProp<AppStackParamList, 'Checkout'>;

interface Props {
  navigation: CartScreenNavigationProp;
}

export const CartScreen = ({ navigation }: Props) => {
  const insets = useSafeAreaInsets();
  const [cartItems, setCartItems] = useState(initialCart);

  const updateQuantity = (id: string, delta: number) => {
    setCartItems(prev => 
      prev.map(item => {
        if (item.id === id) {
          const newQuantity = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  const removeItem = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.05; // 5% tax example
  const total = subtotal + tax;

  const renderItem = ({ item }: any) => (
    <View style={styles.cartItem}>
      <View style={styles.itemImageContainer}>
        <Image source={{ uri: item.image }} style={styles.itemImage} />
      </View>
      
      <View style={styles.itemDetails}>
        <View style={styles.itemHeaderRow}>
          <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
          <TouchableOpacity onPress={() => removeItem(item.id)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Icon name="x" size={18} color={colors.textMuted} />
          </TouchableOpacity>
        </View>
        
        <Text style={styles.itemPrice}>₹{item.price.toLocaleString()}</Text>
        
        <View style={styles.qtyContainer}>
          <TouchableOpacity style={styles.qtyBtn} onPress={() => updateQuantity(item.id, -1)}>
            <Icon name="minus" size={14} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.qtyText}>{item.quantity}</Text>
          <TouchableOpacity style={styles.qtyBtn} onPress={() => updateQuantity(item.id, 1)}>
            <Icon name="plus" size={14} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.main}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />
      
      <Header variant="standard" title="My Cart" rightIcon="trash-2" onRightPress={() => setCartItems([])} />

      {cartItems.length > 0 ? (
        <>
          <FlatList
            data={cartItems}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />

          {/* Sticky Checkout Footer */}
          <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, spacing.md) }]}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>₹{subtotal.toLocaleString()}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tax (5%)</Text>
              <Text style={styles.summaryValue}>₹{tax.toLocaleString()}</Text>
            </View>
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>₹{total.toLocaleString()}</Text>
            </View>
            
            {/* ---> ADDED onPress NAVIGATION HERE <--- */}
            <TouchableOpacity 
              style={styles.checkoutBtn} 
              activeOpacity={0.8}
              onPress={() => navigation.navigate('Checkout')}
            >
              <Text style={styles.checkoutText}>Proceed to Checkout</Text>
              <Icon name="arrow-right" size={20} color={colors.white} />
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <View style={styles.emptyState}>
          <View style={styles.emptyIconCircle}>
            <Icon name="shopping-cart" size={48} color={colors.border} />
          </View>
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySub}>Looks like you haven't added anything yet.</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  main: { flex: 1, backgroundColor: colors.white },
  listContent: { padding: spacing.lg, paddingBottom: 220 }, // Room for footer
  
  // Cart Item
  cartItem: { flexDirection: 'row', backgroundColor: colors.white, borderRadius: radius.lg, padding: spacing.sm, marginBottom: spacing.md, borderWidth: 1, borderColor: colors.border, ...shadows.card },
  itemImageContainer: { width: 80, height: 80, borderRadius: radius.md, backgroundColor: colors.surface, overflow: 'hidden' },
  itemImage: { width: '100%', height: '100%' },
  itemDetails: { flex: 1, marginLeft: spacing.md, justifyContent: 'space-between' },
  itemHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  itemName: { ...typography.bodyLarge, fontFamily: 'Poppins-SemiBold', flex: 1, marginRight: spacing.sm },
  itemPrice: { ...typography.heading, color: colors.primary, fontSize: 16 },
  
  // Quantity Controls
  qtyContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, alignSelf: 'flex-start', borderRadius: radius.full, padding: 2 },
  qtyBtn: { width: 28, height: 28, borderRadius: radius.full, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center', ...shadows.card, shadowOpacity: 0.05 },
  qtyText: { ...typography.bodyLarge, fontFamily: 'Poppins-Bold', width: 36, textAlign: 'center' },

  // Footer
  footer: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: colors.white, paddingHorizontal: spacing.lg, paddingTop: spacing.lg, borderTopWidth: 1, borderTopColor: colors.border, ...shadows.card, shadowOffset: { width: 0, height: -4 } },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm },
  summaryLabel: { ...typography.body, color: colors.textMuted },
  summaryValue: { ...typography.bodyLarge, fontFamily: 'Poppins-SemiBold' },
  totalRow: { borderTopWidth: 1, borderTopColor: colors.border, paddingTop: spacing.sm, marginTop: spacing.xs, marginBottom: spacing.lg },
  totalLabel: { ...typography.heading, fontSize: 18 },
  totalValue: { ...typography.heading, fontSize: 22, color: colors.primary },
  checkoutBtn: { backgroundColor: colors.black, flexDirection: 'row', height: 56, borderRadius: radius.xl, alignItems: 'center', justifyContent: 'center' },
  checkoutText: { ...typography.buttonPrimary, fontSize: 16, marginRight: spacing.sm },

  // Empty State
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 100 },
  emptyIconCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md },
  emptyTitle: { ...typography.heading, fontFamily: 'Poppins-Bold' },
  emptySub: { ...typography.body, color: colors.textMuted, marginTop: spacing.xs },
});