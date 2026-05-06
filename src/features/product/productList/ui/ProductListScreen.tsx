import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ImageBackground,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '@/navigation/types'; 
import { Header } from '@/components/header';
import { colors, spacing, typography, radius, shadows } from '@/theme';

const { width } = Dimensions.get('window');
// Calculate width perfectly for a 2-column grid with padding
const CARD_WIDTH = (width - spacing.lg * 2 - spacing.md) / 2;

// --- Gason Project Dummy Data ---
const categories = ['All', 'Stoves', 'Cylinders', 'Accessories'];

const products = [
  { 
    id: '1', category: 'Stoves', name: 'Premium Gas Stove', price: '₹3000', 
    image: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?q=80&w=500&auto=format&fit=crop' 
  },
  { 
    id: '2', category: 'Cylinders', name: 'Domestic Cylinder 14.2kg', price: '₹1100', 
    // Realistic metal tank placeholder
    image: 'https://images.unsplash.com/photo-1605335198083-d2d46e3e5210?q=80&w=500&auto=format&fit=crop' 
  },
  { 
    id: '3', category: 'Cylinders', name: 'Commercial Cylinder 19kg', price: '₹2200', 
    image: 'https://images.unsplash.com/photo-1622322960899-702e1c9c4391?q=80&w=500&auto=format&fit=crop' 
  },
  { 
    id: '4', category: 'Stoves', name: 'Classic 2 Burner', price: '₹1800', 
    image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=500&auto=format&fit=crop' 
  },
  { 
    id: '5', category: 'Accessories', name: 'Safety Gas Regulator', price: '₹450', 
    // Hardware/tool placeholder
    image: 'https://images.unsplash.com/photo-1584269600519-112d08a72179?q=80&w=500&auto=format&fit=crop' 
  },
  { 
    id: '6', category: 'Accessories', name: 'Flexible Hose Pipe 2m', price: '₹250', 
    image: 'https://images.unsplash.com/photo-1644342531398-e7c653630f9a?q=80&w=500&auto=format&fit=crop' 
  },
];

type ProductListNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'ProductDetail'>;

interface Props {
  navigation: ProductListNavigationProp;
}

export const ProductListScreen = ({ navigation }: Props) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  // Filter logic: Matches Category AND Search Text
  const filteredProducts = products.filter(product => {
    const matchesCategory = activeCategory === 'All' || product.category === activeCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const renderProduct = ({ item }: any) => (
    <TouchableOpacity
      activeOpacity={0.9}
      style={styles.productCard}
      onPress={() => navigation.navigate('ProductDetail', { product: item })}
    >
      <View style={styles.productImageContainer}>
        <ImageBackground
          source={{ uri: item.image }}
          style={styles.productImage}
        />
        <TouchableOpacity style={styles.favoriteBtn} activeOpacity={0.7}>
          <Icon name="heart" size={16} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.productCategory}>{item.category}</Text>
        <Text style={styles.productTitle} numberOfLines={1}>
          {item.name}
        </Text>
        <View style={styles.productPriceRow}>
          <Text style={styles.productPrice}>{item.price}</Text>
          <TouchableOpacity style={styles.addBtn} activeOpacity={0.7}>
            <Icon name="plus" size={16} color={colors.white} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.main}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />

      {/* --- Search Header --- */}
      <Header
        variant="search"
        searchPlaceholder="Search Gason products..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        onRightPress={() => console.log('Filters Opened')}
        useTopInset={true}
      />

      {/* --- Category Selector Pills --- */}
      <View style={styles.categoriesContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesScroll}
        >
          {categories.map((category) => {
            const isActive = activeCategory === category;
            return (
              <TouchableOpacity
                key={category}
                style={[styles.categoryPill, isActive && styles.activeCategoryPill]}
                onPress={() => setActiveCategory(category)}
                activeOpacity={0.7}
              >
                <Text style={[styles.categoryText, isActive && styles.activeCategoryText]}>
                  {category}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* --- Product Grid --- */}
      {filteredProducts.length > 0 ? (
        <FlatList
          data={filteredProducts}
          keyExtractor={item => item.id}
          numColumns={2}
          renderItem={renderProduct}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.columnWrapper}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyState}>
          <Icon name="search" size={48} color={colors.border} />
          <Text style={styles.emptyStateText}>No products found.</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  main: { flex: 1, backgroundColor: colors.white },
  
  // Category Selector Styles
  categoriesContainer: {
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.white,
  },
  categoriesScroll: {
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  categoryPill: {
    paddingHorizontal: spacing.lg,
    paddingVertical: 8,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  activeCategoryPill: {
    backgroundColor: colors.black,
    borderColor: colors.black,
  },
  categoryText: {
    ...typography.body,
    fontFamily: 'Inter_18pt-Medium',
    color: colors.textSecondary,
  },
  activeCategoryText: {
    color: colors.white,
    fontFamily: 'Poppins-SemiBold',
  },

  // Grid Styles
  listContent: { padding: spacing.lg, paddingBottom: 120 }, // Extra padding for bottom tab bar
  columnWrapper: { justifyContent: 'space-between', marginBottom: spacing.md },

  // Card Styles
  productCard: {
    width: CARD_WIDTH,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
    overflow: 'hidden',
  },
  productImageContainer: {
    width: '100%',
    height: 140,
    backgroundColor: colors.surface,
  },
  productImage: { width: '100%', height: '100%' },
  favoriteBtn: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: colors.white,
    padding: 6,
    borderRadius: radius.full,
    ...shadows.card,
  },
  productInfo: { padding: spacing.md },
  productCategory: {
    ...typography.caption,
    color: colors.primary,
    fontFamily: 'Poppins-SemiBold',
    fontSize: 10,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  productTitle: {
    ...typography.body,
    color: colors.textPrimary,
    fontFamily: 'Poppins-SemiBold',
    fontSize: 13,
  },
  productPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  productPrice: { ...typography.heading, color: colors.textPrimary, fontSize: 16 },
  addBtn: {
    backgroundColor: colors.black,
    width: 32,
    height: 32,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Empty State
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
  },
  emptyStateText: {
    ...typography.bodyLarge,
    color: colors.textMuted,
    marginTop: spacing.md,
  },
});