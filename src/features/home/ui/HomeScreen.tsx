import React, { useEffect, useState, useCallback, memo, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  NativeSyntheticEvent,
  NativeScrollEvent,
  RefreshControl,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';

import { useAppDispatch, useAppSelector } from '@/store';
import { fetchHomeData } from '../store/homeThunks';
import { Header } from '@/components/header';
import { ProductCard } from '@/components/ProductCard';
import { colors, spacing, typography, radius, shadows, moderateScale, screenWidth } from '@/theme';
import { Slider, Product, DigitalId } from '../store/homeTypes';

const BANNER_WIDTH = screenWidth() - spacing.lg * 2;
const PRODUCT_CARD_WIDTH = screenWidth() * 0.42; 

const SERVICES = [
  { id: '1', name: 'Survey', icon: 'clipboard', color: colors.primary, route: 'Survey' },
  { id: '2', name: 'Delivery', icon: 'truck', color: '#F39C12', route: 'Delivery' },
  { id: '3', name: 'Emergency', icon: 'alert-triangle', color: '#E74C3C', route: 'Emergency' },
  { id: '4', name: 'Support', icon: 'headphones', color: '#3498DB', route: 'Support' },
];

// ==========================================
// MEMOIZED SUB-COMPONENTS
// ==========================================

const BannerCarousel = memo(({ sliders }: { sliders: Slider[] }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  // PRO OPTIMIZATION: Robust Auto-Slide that resets on manual interaction
  useEffect(() => {
    if (!sliders || sliders.length < 2) return;

    const timer = setTimeout(() => {
      let nextIndex = activeIndex + 1;
      if (nextIndex >= sliders.length) nextIndex = 0;
      
      scrollViewRef.current?.scrollTo({
        x: nextIndex * (BANNER_WIDTH + spacing.md),
        animated: true,
      });
      
      setActiveIndex(nextIndex);
    }, 4500); 

    return () => clearTimeout(timer);
  }, [activeIndex, sliders]);

  const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = Math.round(event.nativeEvent.contentOffset.x / slideSize);
    setActiveIndex(index);
  }, []);

  if (!sliders?.length) return null;

  return (
    <View style={styles.sliderContainer}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        snapToInterval={BANNER_WIDTH + spacing.md}
        decelerationRate="fast"
        contentContainerStyle={styles.sliderContent}
      >
        {sliders.map((banner) => (
          <View key={banner.id.toString()} style={styles.bannerSlide}>
            <Image source={{ uri: banner.image }} style={styles.bannerImage} resizeMode="cover" />
            
            {/* Sleeker, darker gradient for better text readability */}
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.85)']}
              style={styles.bannerOverlay}
            >
              <Text style={styles.bannerTitle} numberOfLines={2}>{banner.title}</Text>
            </LinearGradient>
          </View>
        ))}
      </ScrollView>
      <View style={styles.pagination}>
        {sliders.map((_, i) => (
          <View key={i.toString()} style={[styles.dot, activeIndex === i && styles.activeDot]} />
        ))}
      </View>
    </View>
  );
});

const RealisticDigitalId = memo(({ digitalId }: { digitalId: DigitalId }) => {
  if (!digitalId) return null;

  const formattedNumber = digitalId.cart_number.replace(/(.{4})/g, '$1 ').trim();

  return (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Digital ID</Text>
      </View>
      
      {/* Premium Titanium/Graphite Metal Finish */}
      <LinearGradient
        colors={['#1E1E24', '#2B2B36', '#121216']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.digitalCard}
      >
        {/* Holographic Light Sweep */}
        <LinearGradient
          colors={['rgba(255,255,255,0.2)', 'rgba(255,255,255,0)', 'rgba(255,255,255,0.05)']}
          start={{ x: -0.2, y: -0.2 }}
          end={{ x: 1.5, y: 1.5 }}
          style={StyleSheet.absoluteFillObject}
        />

        <View style={styles.cardTopRow}>
          <Text style={styles.cardBrandName}>
            GASON <Text style={{ fontWeight: '300' }}>PREMIUM</Text>
          </Text>
          <Icon name="wifi" size={24} color="rgba(255,255,255,0.9)" style={{ transform: [{ rotate: '90deg' }] }} />
        </View>

        <View style={styles.cardChipRow}>
          <LinearGradient colors={['#F5D76E', '#D4AF37', '#967113']} style={styles.emvChip}>
            <View style={styles.chipLineContainer}>
              <View style={styles.chipLine} />
              <View style={styles.chipLine} />
              <View style={styles.chipLineVertical} />
            </View>
          </LinearGradient>
        </View>

        <View style={styles.cardMiddleRow}>
          <Text style={styles.cardUserId}>{formattedNumber}</Text>
        </View>

        <View style={styles.cardBottomRow}>
          <View>
            <Text style={styles.cardDateLabel}>MEMBER NAME</Text>
            <Text style={styles.cardUserName} numberOfLines={1}>{digitalId.name.toUpperCase()}</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.cardDateLabel}>VALID THRU</Text>
            <Text style={styles.cardDateValue}>{digitalId.expiry_date}</Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
});

const ProductCarousel = memo(({ title, products, navigation }: { title: string; products: Product[]; navigation: any }) => {
  if (!products?.length) return null;

  const showBadge = title.toLowerCase().includes('featured');

  return (
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <TouchableOpacity style={styles.seeAllBtn} activeOpacity={0.7} onPress={() => navigation.navigate('Products')}>
          <Text style={styles.seeAllText}>See All</Text>
          <Icon name="chevron-right" size={16} color={colors.primary} style={{ marginTop: 2 }} />
        </TouchableOpacity>
      </View>
      
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.productsScroll}
        snapToInterval={PRODUCT_CARD_WIDTH + spacing.md}
        decelerationRate="fast"
      >
        {products.map((item) => (
          <ProductCard
            key={item.id.toString()}
            item={item}
            cardWidth={PRODUCT_CARD_WIDTH}
            showBadge={showBadge}
            onPress={() => navigation.navigate('ProductDetail', { product: item })}
          />
        ))}
      </ScrollView>
    </View>
  );
});

const ServicesGrid = memo(({ navigation }: { navigation: any }) => (
  <View style={styles.sectionContainer}>
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>Services</Text>
    </View>
    <View style={styles.servicesGrid}>
      {SERVICES.map((service) => (
        <TouchableOpacity
          key={service.id}
          activeOpacity={0.7}
          style={styles.serviceItem}
          onPress={() => navigation.navigate(service.route)}
        >
          {/* Luxury Minimalist Floating Circle */}
          <View style={styles.serviceIconContainer}>
            <Icon name={service.icon} size={24} color={service.color} />
          </View>
          <Text style={styles.serviceName}>{service.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  </View>
));

// ==========================================
// MAIN SCREEN
// ==========================================

export const HomeScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();

  const { user } = useAppSelector((state) => state.auth);
  const { data, isLoading, isRefreshing } = useAppSelector((state) => state.home);
  console.log("user in home screen", user);
  useEffect(() => {
    dispatch(fetchHomeData(false));
  }, [dispatch]);

  const onRefresh = useCallback(() => {
    dispatch(fetchHomeData(true));
  }, [dispatch]);

  if (isLoading && !data) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  const primaryDigitalId = data?.digital_ids?.[0];

  return (
    <View style={styles.main}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" translucent={true} />

      <Header
        variant="main"
        userName={user?.name || 'Guest'}
        onRightPress={() => console.log('Notifications')}
      />

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: Math.max(insets.bottom, 4) - 2 }]}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} colors={[colors.primary]} tintColor={colors.primary} />}
      >
        <BannerCarousel sliders={data?.sliders || []} />
        
        {primaryDigitalId && <RealisticDigitalId digitalId={primaryDigitalId} />}
        
        <ProductCarousel 
          title="Featured Products" 
          products={data?.featured_products || []} 
          navigation={navigation} 
        />
        
        <ProductCarousel 
          title="Best Selling" 
          products={data?.best_selling_products || []} 
          navigation={navigation} 
        />

        <ServicesGrid navigation={navigation} />
      </ScrollView>
    </View>
  );
};

// ==========================================
// STYLES
// ==========================================

const styles = StyleSheet.create({
  main: { 
    flex: 1, 
    backgroundColor: '#FFFFFF', // Strict White Background
  },
  loadingContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#FFFFFF' 
  },
  scrollContent: { 
    paddingTop: spacing.md 
  },
  sectionContainer: {
    marginBottom: spacing.xxl, 
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  sectionTitle: { 
    ...typography.heading, 
    color: colors.textPrimary,
    fontSize: moderateScale(19), 
    fontFamily: typography.screenTitle.fontFamily, // Bolder, premium look
  },
  seeAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllText: { 
    ...typography.link,
    color: colors.primary,
    fontSize: moderateScale(13),
    marginRight: 2,
  },

  // Banner Styles
  sliderContainer: { 
    marginBottom: spacing.xl 
  },
  sliderContent: { 
    paddingHorizontal: spacing.lg, 
    gap: spacing.md 
  },
  bannerSlide: {
    width: BANNER_WIDTH,
    borderRadius: radius.lg,
    height: moderateScale(170), 
    overflow: 'hidden',
    backgroundColor: colors.surface,
    ...shadows.card,
  },
  bannerImage: { 
    width: '100%', 
    height: '100%', 
    position: 'absolute' 
  },
  bannerOverlay: { 
    flex: 1, 
    justifyContent: 'flex-end', 
    padding: spacing.xl 
  },
  bannerTitle: { 
    ...typography.heading, 
    color: colors.white,
    fontSize: moderateScale(20),
    lineHeight: moderateScale(26),
    fontFamily: typography.screenTitle.fontFamily,
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  pagination: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    marginTop: spacing.md 
  },
  dot: { 
    width: 6, 
    height: 6, 
    borderRadius: radius.full, 
    backgroundColor: colors.border, 
    marginHorizontal: spacing.xs 
  },
  activeDot: { 
    backgroundColor: colors.primary, 
    width: 24, // Pill shape for modern feel
  },

  // Premium Digital ID Card Styles
  digitalCard: {
    marginHorizontal: spacing.lg,
    borderRadius: radius.xl,
    padding: spacing.xl,
    ...shadows.card,
    elevation: 12,
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    overflow: 'hidden',
    aspectRatio: 1.586, 
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardBrandName: {
    color: colors.white,
    fontFamily: typography.screenTitle.fontFamily,
    fontSize: moderateScale(15),
    letterSpacing: 3,
  },
  cardChipRow: {
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  emvChip: {
    width: 42,
    height: 30,
    borderRadius: radius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 3,
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.5)',
  },
  chipLineContainer: {
    width: '100%',
    height: '100%',
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.3)',
    borderRadius: 4,
    justifyContent: 'space-evenly',
    position: 'relative',
  },
  chipLine: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    width: '100%',
  },
  chipLineVertical: {
    position: 'absolute',
    width: 1,
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.4)',
    left: '50%',
  },
  cardMiddleRow: {
    flex: 1,
    justifyContent: 'center',
  },
  cardUserId: {
    color: '#F4F4F4',
    fontFamily: 'Courier', 
    fontSize: moderateScale(22),
    letterSpacing: 4,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0,0,0,0.9)',
    textShadowOffset: { width: -1, height: 1.5 },
    textShadowRadius: 3,
  },
  cardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  cardDateLabel: {
    color: 'rgba(255,255,255,0.6)',
    ...typography.caption,
    fontSize: moderateScale(9),
    letterSpacing: 1.5,
  },
  cardUserName: {
    color: '#F4F4F4',
    fontFamily: 'Courier',
    fontSize: moderateScale(14),
    fontWeight: 'bold',
    marginTop: 2,
    letterSpacing: 1.5,
    textShadowColor: 'rgba(0,0,0,0.9)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 2,
  },
  cardDateValue: {
    color: '#F4F4F4',
    fontFamily: 'Courier',
    fontSize: moderateScale(14),
    fontWeight: 'bold',
    marginTop: 2,
    letterSpacing: 1,
    textShadowColor: 'rgba(0,0,0,0.9)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 2,
  },

  // Carousel product spacing container
  productsScroll: { 
    paddingHorizontal: spacing.lg, 
    gap: spacing.md ,
  },

  // Services Grid
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginHorizontal: spacing.lg,
    rowGap: spacing.lg,
  },
  serviceItem: { 
    alignItems: 'center', 
    width: '22%' 
  },
  serviceIconContainer: { 
    width: moderateScale(56), 
    height: moderateScale(56), 
    borderRadius: moderateScale(28), 
    backgroundColor: '#FFFFFF', 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginBottom: spacing.sm,
    ...shadows.card,
    elevation: 4,
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  serviceName: { 
    ...typography.caption, 
    color: colors.textPrimary,
    fontFamily: typography.bodyLarge.fontFamily,
    fontSize: moderateScale(11),
  },
});