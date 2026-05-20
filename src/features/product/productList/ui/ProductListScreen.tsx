import React, { useEffect, useCallback, useState, memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ImageBackground,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useDispatch, useSelector } from 'react-redux';

import { AppDispatch, RootState } from '@/store';
import { useDebounce } from '@/hooks/useDebounce';
import { AuthStackParamList } from '@/navigation/types';
import { Header } from '@/components/header';
import { colors, spacing, typography } from '@/theme';
import { useResponsive } from '@/theme/layout'; 

import { fetchProducts, searchProducts } from '../store/productThunks';
import { setSearchQuery, resetProducts } from '../store/productSlice';

type ProductListNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'ProductDetail'>;

interface Props {
  navigation: ProductListNavigationProp;
}

// ------------------------------------------------------------------
// PRO OPTIMIZATION 1: Memoized Product Card with PREMIUM DESIGN
// ------------------------------------------------------------------
const ProductCard = memo(({ 
  item, 
  cardWidth, 
  onPress 
}: { 
  item: any; 
  cardWidth: number; 
  onPress: () => void 
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={[styles.productCard, { width: cardWidth }]}
      onPress={onPress}
    >
      <View style={styles.productImageContainer}>
        <ImageBackground
          source={{ uri: item.image }}
          style={styles.productImage}
          resizeMode="cover"
        />
        {/* Modern floating favorite button */}
        <TouchableOpacity style={styles.favoriteBtn} activeOpacity={0.7}>
          <Icon name="heart" size={16} color="#000000" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.productInfo}>
        <Text style={styles.productTitle} numberOfLines={2}>
          {item.name}
        </Text>
        
        <View style={styles.productPriceRow}>
          <Text style={styles.productPrice}>
            {Number(item.price) > 0 ? `₹${item.price}` : 'Free'}
          </Text>
          
          {/* Sleek, circular action button */}
          <TouchableOpacity style={styles.addBtn} activeOpacity={0.8}>
            <Icon name="plus" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}, (prevProps, nextProps) => {
  return prevProps.item.product_id === nextProps.item.product_id && 
         prevProps.cardWidth === nextProps.cardWidth;
});

// ------------------------------------------------------------------
// MAIN SCREEN
// ------------------------------------------------------------------
export const ProductListScreen = ({ navigation }: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const [refreshing, setRefreshing] = useState(false);
  
  const { width, isTablet, isPortrait } = useResponsive();

  const { items, loading, loadingMore, hasMore, offset, searchQuery } = useSelector(
    (state: RootState) => state.product
  );

  const debouncedSearch = useDebounce(searchQuery, 500);
  
  const numColumns = isTablet ? (isPortrait ? 3 : 4) : 2;
  const CARD_WIDTH = (width - spacing.lg * 2 - (spacing.md * (numColumns - 1))) / numColumns;

  // Handle Initial Load & Searching
  useEffect(() => {
    if (debouncedSearch.trim() !== '') {
      dispatch(searchProducts({ query: debouncedSearch }));
    } else {
      dispatch(resetProducts());
      dispatch(fetchProducts({ offset: 0 }));
    }
  }, [debouncedSearch, dispatch]);

  // Handle Pull-to-Refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    if (debouncedSearch.trim() !== '') {
      await dispatch(searchProducts({ query: debouncedSearch }));
    } else {
      dispatch(resetProducts());
      await dispatch(fetchProducts({ offset: 0 }));
    }
    setRefreshing(false);
  }, [debouncedSearch, dispatch]);

  // Handle Infinite Scrolling
  const handleLoadMore = useCallback(() => {
    if (!loading && !loadingMore && hasMore && debouncedSearch === '') {
      dispatch(fetchProducts({ offset }));
    }
  }, [loading, loadingMore, hasMore, offset, debouncedSearch, dispatch]);

  // Render callback passed to FlatList
  const renderItem = useCallback(({ item }: any) => {
    return (
      <ProductCard 
        item={item} 
        cardWidth={CARD_WIDTH} 
        onPress={() => navigation.navigate('ProductDetail', { product: item })} 
      />
    );
  }, [navigation, CARD_WIDTH]); 

  const renderFooter = useCallback(() => {
    if (!loadingMore) return <View style={styles.footerSpacer} />;
    return (
      <View style={styles.loaderFooter}>
        <ActivityIndicator size="small" color="#000000" />
      </View>
    );
  }, [loadingMore]);

  const keyExtractor = useCallback((item: any, index: number) => {
    return `${item.product_id}-${index}`;
  }, []);

  return (
    <View style={styles.main}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" translucent={true} />

      <Header
        variant="search"
        searchPlaceholder="Search products..."
        searchValue={searchQuery}
        onSearchChange={(text) => dispatch(setSearchQuery(text))}
        useTopInset={true}
        style={styles.headerStyle}
      />

      {loading && items.length === 0 && !refreshing ? (
        <View style={styles.centerStage}>
          <ActivityIndicator size="large" color="#000000" />
        </View>
      ) : items.length > 0 ? (
        <FlatList
          data={items}
          keyExtractor={keyExtractor}
          numColumns={numColumns}
          key={numColumns} 
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          columnWrapperStyle={styles.columnWrapper}
          showsVerticalScrollIndicator={false}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
          
          removeClippedSubviews={Platform.OS === 'android'}
          initialNumToRender={10} 
          maxToRenderPerBatch={10} 
          windowSize={11} 
          
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#000000"
              colors={['#000000']} 
              progressBackgroundColor="#FFFFFF" 
            />
          }
        />
      ) : (
        <View style={styles.centerStage}>
          <View style={styles.emptyIconContainer}>
            <Icon name="package" size={42} color="#CCCCCC" />
          </View>
          <Text style={styles.emptyStateTitle}>No Products Found</Text>
          <Text style={styles.emptyStateText}>Try adjusting your search terms.</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  main: { 
    flex: 1, 
    backgroundColor: '#FFFFFF', 
  },
  headerStyle: { 
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  listContent: { 
    padding: spacing.lg, 
  },
  columnWrapper: { 
    justifyContent: 'space-between', 
    // Increased bottom margin for better vertical spacing between the new cards
    marginBottom: spacing.lg, 
  },
  
  // -----------------------------------------
  // NEW PREMIUM CARD STYLES
  // -----------------------------------------
  productCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16, // Smoother, modern corners
    // Removed the stark border, using a soft elegant shadow instead
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 5,
  },
  productImageContainer: {
    width: '100%',
    height: 180, // Taller image area for a luxury feel
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  productImage: { 
    width: '100%', 
    height: '100%',
  },
  favoriteBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#FFFFFF', // Clean white
    padding: 8,
    borderRadius: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productInfo: { 
    padding: 16, // Generous padding
  },
  productTitle: {
    ...typography.body,
    color: '#1A1A1A',
    fontFamily: 'Poppins-Medium',
    fontSize: 14, // Slightly larger for readability
    lineHeight: 20,
    minHeight: 40, 
  },
  productPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  productPrice: { 
    ...typography.heading, 
    color: '#000000', 
    fontSize: 16, // Bold, clear price
    fontFamily: 'Poppins-Bold',
    letterSpacing: -0.5,
  },
  addBtn: {
    backgroundColor: '#000000', 
    width: 40, // Perfect, larger circle
    height: 40,
    borderRadius: 20, 
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  
  // States
  centerStage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: spacing.xl,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F8F8F8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  emptyStateTitle: {
    ...typography.heading,
    fontSize: 18,
    color: '#000000',
    marginBottom: 4,
  },
  emptyStateText: {
    ...typography.body,
    color: '#888888',
    textAlign: 'center',
  },
  loaderFooter: {
    paddingVertical: spacing.lg,
    alignItems: 'center',
    paddingBottom: 120,
  },
  footerSpacer: {
    height: 120,
  },
});