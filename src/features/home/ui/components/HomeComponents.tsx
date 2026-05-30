import React, { memo, useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';
import { ProductCard } from '@/components/ProductCard';
import {
  colors,
  spacing,
  typography,
  moderateScale,
  screenWidth,
} from '@/theme';
import { Slider, Product, SubscriptionUser } from '../../store/homeTypes';

const BANNER_WIDTH = screenWidth() - spacing.lg * 2;
const PRODUCT_CARD_WIDTH = screenWidth() * 0.42;

const SERVICES = [
  {
    id: '1',
    name: 'Survey',
    icon: 'clipboard',
    color: colors.primary,
    bgColor: '#F0FDF4',
    route: 'Survey',
  },
  {
    id: '2',
    name: 'Delivery',
    icon: 'truck',
    color: '#D97706',
    bgColor: '#FEF3C7',
    route: 'Delivery',
  },
  {
    id: '3',
    name: 'Emergency',
    icon: 'alert-triangle',
    color: '#DC2626',
    bgColor: '#FEE2E2',
    route: 'Emergency',
  },
  {
    id: '4',
    name: 'Support',
    icon: 'headphones',
    color: '#2563EB',
    bgColor: '#DBEAFE',
    route: 'Support',
  },
];

export const BannerCarousel = memo(({ sliders }: { sliders: Slider[] }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

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

  const handleScroll = useCallback((event: any) => {
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
        {sliders.map(banner => (
          <View key={banner.id.toString()} style={styles.bannerSlide}>
            <Image
              source={{ uri: banner.image }}
              style={styles.bannerImage}
              resizeMode="cover"
            />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.1)', 'rgba(0,0,0,0.8)']}
              style={styles.bannerOverlay}
            >
              <Text style={styles.bannerTitle} numberOfLines={2}>
                {banner.title}
              </Text>
            </LinearGradient>
          </View>
        ))}
      </ScrollView>
      <View style={styles.pagination}>
        {sliders.map((_, i) => (
          <View
            key={i.toString()}
            style={[styles.dot, activeIndex === i && styles.activeDot]}
          />
        ))}
      </View>
    </View>
  );
});

// ==========================================
// DYNAMIC DIGITAL ID CARD
// ==========================================
export const RealisticDigitalId = memo(
  ({
    subscriptionData,
    userName,
  }: {
    subscriptionData: SubscriptionUser;
    userName: string;
  }) => {
    if (!subscriptionData) return null;

    // 1. Dynamic Card Number Formatting
    const rawNumber = subscriptionData.card_number || '0000 0000 0000 0000';
    const formattedNumber = rawNumber.replace(/(.{4})/g, '$1 ').trim();

    // 2. Dynamic Expiry Date Formatting (e.g., 2026-05-28 -> 05/26)
    let expiryDisplay = 'LIFETIME';
    if (subscriptionData.subscription_end_date) {
      const date = new Date(subscriptionData.subscription_end_date);
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = String(date.getFullYear()).slice(-2);
      expiryDisplay = `${month}/${year}`;
    }

    return (
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Digital ID</Text>
        </View>

        <LinearGradient
          colors={['#0F172A', '#1E293B', '#020617']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.digitalCard}
        >
          <LinearGradient
            colors={[
              'rgba(255,255,255,0.1)',
              'rgba(255,255,255,0)',
              'rgba(0,194,111,0.05)',
            ]}
            start={{ x: -0.2, y: -0.2 }}
            end={{ x: 1.5, y: 1.5 }}
            style={StyleSheet.absoluteFillObject}
          />

          <View style={styles.cardTopRow}>
            <Text style={styles.cardBrandName}>
              MY GASON{' '}
              <Text style={{ fontWeight: '400', color: colors.primary }}>
                PRO
              </Text>
            </Text>
            <Icon
              name="wifi"
              size={20}
              color="rgba(255,255,255,0.8)"
              style={{ transform: [{ rotate: '90deg' }] }}
            />
          </View>

          <View style={styles.cardChipRow}>
            <LinearGradient
              colors={['#FDE047', '#EAB308', '#A16207']}
              style={styles.emvChip}
            >
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
              <Text style={styles.cardUserName} numberOfLines={1}>
                {userName.toUpperCase()}
              </Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.cardDateLabel}>VALID THRU</Text>
              <Text style={styles.cardDateValue}>{expiryDisplay}</Text>
            </View>
          </View>
        </LinearGradient>
      </View>
    );
  },
);

// ==========================================
// SUBSCRIPTION / RENEWAL CARD
// ==========================================
interface SubscriptionCardProps {
  onPress: () => void;
  price: string;
  isRenewal: boolean;
}

export const SubscriptionCard = memo(
  ({ onPress, price, isRenewal }: SubscriptionCardProps) => {
    return (
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {isRenewal ? 'Renew Premium' : 'Unlock Premium'}
          </Text>
        </View>

        <TouchableOpacity activeOpacity={0.9} onPress={onPress}>
          <View style={styles.subscriptionCard}>
            <View style={styles.subscriptionHeader}>
              <View style={styles.badgeContainer}>
                <Icon
                  name={isRenewal ? 'refresh-cw' : 'zap'}
                  size={14}
                  color="#D4AF37"
                />
                <Text style={styles.subscriptionBadgeText}>
                  {isRenewal ? 'SUBSCRIPTION EXPIRED' : 'MY GASON EXCLUSIVE'}
                </Text>
              </View>
            </View>

            <Text style={styles.subscriptionTitle}>
              {isRenewal ? 'Renew Your Digital ID' : 'Get Your Digital ID'}
            </Text>
            <Text style={styles.subscriptionDesc}>
              {isRenewal
                ? 'Your My Gason Premium membership has ended. Renew now to maintain priority delivery and member-only pricing.'
                : 'Join My Gason Premium to unlock exclusive LERC products, lightning-fast priority delivery, and member-only pricing.'}
            </Text>

            <View style={styles.subscriptionPriceRow}>
              <Text style={styles.subscriptionCurrency}>₹</Text>
              <Text style={styles.subscriptionPrice}>{price}</Text>
              <Text style={styles.subscriptionDuration}>/ year</Text>
            </View>

            <LinearGradient
              colors={[colors.primary, '#00A859']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.subscriptionBtn}
            >
              <Text style={styles.subscriptionBtnText}>
                {isRenewal ? 'Renew with UPI/Card' : 'Subscribe with UPI/Card'}
              </Text>
              <Icon name="arrow-right" size={18} color="#FFFFFF" />
            </LinearGradient>
          </View>
        </TouchableOpacity>
      </View>
    );
  },
);

export const ProductCarousel = memo(
  ({
    title,
    products,
    navigation,
  }: {
    title: string;
    products: Product[];
    navigation: any;
  }) => {
    if (!products?.length) return null;
    const showBadge =
      title.toLowerCase().includes('lerc') ||
      title.toLowerCase().includes('featured');

    return (
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{title}</Text>
          <TouchableOpacity
            style={styles.seeAllBtn}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('Products')}
          >
            <Text style={styles.seeAllText}>See All</Text>
            <Icon
              name="chevron-right"
              size={16}
              color={colors.primary}
              style={{ marginTop: 2 }}
            />
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.productsScroll}
          snapToInterval={PRODUCT_CARD_WIDTH + spacing.md}
          decelerationRate="fast"
        >
          {products.map(item => (
            <ProductCard
              key={item.id.toString()}
              item={item}
              cardWidth={PRODUCT_CARD_WIDTH}
              showBadge={showBadge}
              onPress={() =>
                navigation.navigate('ProductDetail', { product: item })
              }
            />
          ))}
        </ScrollView>
      </View>
    );
  },
);

export const ServicesGrid = memo(({ navigation }: { navigation: any }) => (
  <View style={styles.sectionContainer}>
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>Services</Text>
    </View>
    <View style={styles.servicesGrid}>
      {SERVICES.map(service => (
        <TouchableOpacity
          key={service.id}
          activeOpacity={0.7}
          style={styles.serviceItem}
          onPress={() => navigation.navigate(service.route)}
        >
          <View
            style={[
              styles.serviceIconContainer,
              { backgroundColor: service.bgColor },
            ]}
          >
            <Icon name={service.icon} size={24} color={service.color} />
          </View>
          <Text style={styles.serviceName}>{service.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  </View>
));

const styles = StyleSheet.create({
  sectionContainer: { marginBottom: spacing.xxl },
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
    fontSize: moderateScale(20),
    fontFamily: typography.screenTitle.fontFamily,
    letterSpacing: -0.3,
    fontWeight: '700',
  },
  seeAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(0,194,111,0.06)',
  },
  seeAllText: {
    ...typography.link,
    color: colors.primary,
    fontSize: moderateScale(12),
    fontWeight: '700',
    marginRight: 2,
  },

  sliderContainer: { marginBottom: spacing.xl },
  sliderContent: { paddingHorizontal: spacing.lg, gap: spacing.md },
  bannerSlide: {
    width: BANNER_WIDTH,
    borderRadius: 20,
    height: moderateScale(170),
    overflow: 'hidden',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    elevation: 0,
  },
  bannerImage: { width: '100%', height: '100%', position: 'absolute' },
  bannerOverlay: { flex: 1, justifyContent: 'flex-end', padding: spacing.lg },
  bannerTitle: {
    ...typography.heading,
    color: colors.white,
    fontSize: moderateScale(18),
    lineHeight: moderateScale(24),
    fontFamily: typography.screenTitle.fontFamily,
    fontWeight: '600',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.md,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 4,
  },
  activeDot: { backgroundColor: colors.primary, width: 20 },

  subscriptionCard: {
    marginHorizontal: spacing.lg,
    borderRadius: 20,
    padding: spacing.xl,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 1,
  },
  subscriptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  subscriptionBadgeText: {
    color: '#B45309',
    fontFamily: typography.screenTitle.fontFamily,
    fontSize: moderateScale(10),
    letterSpacing: 1,
    marginLeft: 6,
    fontWeight: '700',
  },
  subscriptionTitle: {
    color: colors.textPrimary,
    fontSize: moderateScale(22),
    fontWeight: '800',
    marginBottom: spacing.xs,
    fontFamily: typography.screenTitle.fontFamily,
    letterSpacing: -0.5,
  },
  subscriptionDesc: {
    color: colors.textSecondary,
    fontSize: moderateScale(13),
    lineHeight: moderateScale(20),
    marginBottom: spacing.lg,
  },
  subscriptionPriceRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.xl,
  },
  subscriptionCurrency: {
    color: colors.textPrimary,
    fontSize: moderateScale(16),
    fontWeight: '700',
    marginTop: 4,
    marginRight: 2,
  },
  subscriptionPrice: {
    color: colors.textPrimary,
    fontSize: moderateScale(34),
    fontWeight: '800',
    fontFamily: typography.screenTitle.fontFamily,
    letterSpacing: -1,
  },
  subscriptionDuration: {
    color: colors.textSecondary,
    fontSize: moderateScale(14),
    marginLeft: 4,
    marginTop: 14,
    fontWeight: '500',
  },
  subscriptionBtn: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 0,
  },
  subscriptionBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: moderateScale(14),
    marginRight: 8,
  },

  digitalCard: {
    marginHorizontal: spacing.lg,
    borderRadius: 20,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
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
    fontSize: moderateScale(14),
    letterSpacing: 2,
    fontWeight: '700',
  },
  cardChipRow: { marginTop: spacing.md, marginBottom: spacing.lg },
  emvChip: {
    width: 38,
    height: 28,
    borderRadius: 6,
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
    borderColor: 'rgba(0,0,0,0.4)',
    borderRadius: 4,
    justifyContent: 'space-evenly',
    position: 'relative',
  },
  chipLine: { height: 1, backgroundColor: 'rgba(0,0,0,0.5)', width: '100%' },
  chipLineVertical: {
    position: 'absolute',
    width: 1,
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    left: '50%',
  },
  cardMiddleRow: { flex: 1, justifyContent: 'center' },
  cardUserId: {
    color: '#F8FAFC',
    fontFamily: 'Courier',
    fontSize: moderateScale(20),
    letterSpacing: 4,
    fontWeight: '700',
  },
  cardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  cardDateLabel: {
    color: 'rgba(255,255,255,0.6)',
    ...typography.caption,
    fontSize: moderateScale(8),
    letterSpacing: 1,
    marginBottom: 2,
  },
  cardUserName: {
    color: '#F8FAFC',
    fontFamily: 'Courier',
    fontSize: moderateScale(13),
    fontWeight: '700',
    letterSpacing: 1,
  },
  cardDateValue: {
    color: '#F8FAFC',
    fontFamily: 'Courier',
    fontSize: moderateScale(13),
    fontWeight: '700',
    letterSpacing: 1,
  },

  productsScroll: { paddingHorizontal: spacing.lg, gap: spacing.md },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginHorizontal: spacing.lg,
    rowGap: spacing.lg,
  },
  serviceItem: { alignItems: 'center', width: '22%' },
  serviceIconContainer: {
    width: moderateScale(56),
    height: moderateScale(56),
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    elevation: 0,
  },
  serviceName: {
    ...typography.caption,
    color: colors.textPrimary,
    fontFamily: typography.bodyLarge.fontFamily,
    fontSize: moderateScale(11),
    fontWeight: '600',
  },
});
