import React, { useEffect, useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
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
import { spacing, typography } from '@/theme';
import { useResponsive } from '@/theme/layout'; 

import { fetchProducts, searchProducts } from '../store/productThunks';
import { setSearchQuery, resetProducts } from '../store/productSlice';
import { ProductCard } from '@/components/ProductCard'; // <-- Import the shared card

type ProductListNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'ProductDetail'>;

interface Props {
  navigation: ProductListNavigationProp;
}

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

  useEffect(() => {
    if (debouncedSearch.trim() !== '') {
      dispatch(searchProducts({ query: debouncedSearch }));
    } else {
      dispatch(resetProducts());
      dispatch(fetchProducts({ offset: 0 }));
    }
  }, [debouncedSearch, dispatch]);

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

  const handleLoadMore = useCallback(() => {
    if (!loading && !loadingMore && hasMore && debouncedSearch === '') {
      dispatch(fetchProducts({ offset }));
    }
  }, [loading, loadingMore, hasMore, offset, debouncedSearch, dispatch]);

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
    const id = item.product_id || item.id || index;
    return `${id}-${index}`;
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
    marginBottom: spacing.lg, 
  },
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