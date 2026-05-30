import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  StatusBar,
  RefreshControl,
  ActivityIndicator,
  Platform,
  UIManager,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { Header } from '@/components/header';
import { colors, spacing } from '@/theme';

import { useHomeViewModel } from './useHomeViewModel';
import { 
  BannerCarousel, 
  RealisticDigitalId, 
  SubscriptionCard, 
  ProductCarousel, 
  ServicesGrid 
} from './components/HomeComponents';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export const HomeScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  
  const {
    user,
    data,
    subscriptionData, // Data source for ID Card
    isLoading,
    isRefreshing,
    hasValidSubscription,
    isRenewal,
    displayPrice,
    featuredProducts,
    onRefresh,
    handleRazorpayPayment,
  } = useHomeViewModel();

  if (isLoading && !data) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.main}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" translucent={true} />

      <LinearGradient 
        colors={[colors.primary + '11', 'rgba(255,255,255,0)']} 
        style={styles.glowAccentTop} 
        start={{ x: 0, y: 0 }} 
        end={{ x: 1, y: 1 }} 
      />

      <Header 
        variant="main" 
        userName={user?.name || 'Guest'} 
        onRightPress={() => console.log('Notifications')} 
      />

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: Math.max(insets.bottom, 4) - 2 }]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} colors={[colors.primary]} tintColor={colors.primary} />
        }
      >
        <BannerCarousel sliders={data?.sliders || []} />
        
        <ServicesGrid navigation={navigation} />

        {/* Dynamic Display Logic */}
        {hasValidSubscription && subscriptionData ? (
          <RealisticDigitalId 
            subscriptionData={subscriptionData} 
            userName={user?.name || 'MEMBER'} 
          />
        ) : (
          <SubscriptionCard 
            price={displayPrice}
            isRenewal={isRenewal}
            onPress={handleRazorpayPayment} 
          />
        )}

        <ProductCarousel title="LERC Products" products={featuredProducts} navigation={navigation} />
        
        <ProductCarousel title="Best Selling" products={data?.best_selling_products || []} navigation={navigation} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  glowAccentTop: {
    position: 'absolute',
    top: -100,
    right: -100,
    width: 400,
    height: 400,
    borderRadius: 200,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingTop: spacing.md,
  },
});