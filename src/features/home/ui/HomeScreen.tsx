import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ImageBackground,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';
import { Header } from '@/components/header';
import { colors, spacing, typography, radius, shadows } from '@/theme';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');
const BANNER_WIDTH = width - spacing.lg * 2;
const PRODUCT_CARD_WIDTH = width * 0.55;

// --- Dummy Data ---
const banners = [
  {
    id: '1',
    title: 'Special Offer',
    subtitle: 'On your First 2 Bookings',
    color1: '#1A1A2E',
    color2: '#16213E',
  },
  {
    id: '2',
    title: 'Free Survey',
    subtitle: 'Book your free survey today',
    color1: colors.primary,
    color2: colors.primaryDark,
  },
];

const digitalCardData = {
  name: 'Surendhar',
  id: 'GAS - 0982 3410',
  validThru: '12/28',
};

const products = [
  {
    id: '1',
    name: 'Premium Stove',
    price: '₹3000',
    image:
      'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?q=80&w=500&auto=format&fit=crop',
  },
  {
    id: '2',
    name: 'Eco Burner 3',
    price: '₹4500',
    image:
      'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?q=80&w=500&auto=format&fit=crop',
  },
  {
    id: '3',
    name: 'Smart Gas Hub',
    price: '₹5500',
    image:
      'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?q=80&w=500&auto=format&fit=crop',
  },
];

const services = [
  {
    id: '1',
    name: 'Survey',
    icon: 'clipboard',
    color: colors.primary,
    route: 'Survey',
  },
  {
    id: '2',
    name: 'Delivery',
    icon: 'truck',
    color: '#F39C12',
    route: 'Delivery',
  },
  {
    id: '3',
    name: 'Emergency',
    icon: 'alert-triangle',
    color: '#E74C3C',
    route: 'Emergency',
  },
  {
    id: '4',
    name: 'Support',
    icon: 'headphones',
    color: '#3498DB',
    route: 'Support',
  },
];

export const HomeScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const [activeBanner, setActiveBanner] = useState(0);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    setActiveBanner(Math.round(index));
  };

  return (
    <View style={styles.main}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent={true}
      />

      {/* Header automatically handles top padding now */}
      <Header
        variant="main"
        userName="Surendhar"
        onRightPress={() => console.log('Notifications')}
      />

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(insets.bottom, 40) + 80 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* --- 1. Banner Slider Section --- */}
        <View style={styles.sliderContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={handleScroll}
            snapToInterval={BANNER_WIDTH + spacing.md}
            decelerationRate="fast"
            contentContainerStyle={{
              paddingHorizontal: spacing.lg,
              gap: spacing.md,
            }}
          >
            {banners.map(banner => (
              <LinearGradient
                key={banner.id}
                colors={[banner.color1, banner.color2]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.bannerSlide}
              >
                <View style={styles.bannerContent}>
                  <Text style={styles.bannerWelcome}>GASON INDIA</Text>
                  <Text style={styles.bannerTitle}>{banner.title}</Text>
                  <Text style={styles.bannerSubtitle}>{banner.subtitle}</Text>
                </View>
                <Icon
                  name="star"
                  size={60}
                  color="rgba(255,255,255,0.1)"
                  style={styles.bannerIcon}
                />
              </LinearGradient>
            ))}
          </ScrollView>
          <View style={styles.pagination}>
            {banners.map((_, index) => (
              <View
                key={index}
                style={[styles.dot, activeBanner === index && styles.activeDot]}
              />
            ))}
          </View>
        </View>

        {/* --- 2. Digital Card Section --- */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Digital ID</Text>
        </View>
        <LinearGradient
          colors={[colors.primary, '#009B59']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.digitalCard}
        >
          {/* Card Decoration */}
          <Icon
            name="hexagon"
            size={150}
            color="rgba(255,255,255,0.05)"
            style={styles.cardWatermark}
          />

          <View style={styles.cardTopRow}>
            <View style={styles.cardLogo}>
              <View style={styles.logoCircle}>
                <Icon name="hexagon" size={16} color={colors.primary} />
              </View>
              <Text style={styles.cardBrandName}>GASON</Text>
            </View>
            <Icon name="cpu" size={28} color="rgba(255,255,255,0.9)" />{' '}
            {/* Modern Chip Icon */}
          </View>

          <View style={styles.cardMiddleRow}>
            <Text style={styles.cardUserId}>{digitalCardData.id}</Text>
          </View>

          <View style={styles.cardBottomRow}>
            <View>
              <Text style={styles.cardDateLabel}>CARDHOLDER</Text>
              <Text style={styles.cardUserName}>{digitalCardData.name}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.cardDateLabel}>VALID THRU</Text>
              <Text style={styles.cardDateValue}>
                {digitalCardData.validThru}
              </Text>
            </View>
          </View>
        </LinearGradient>

        {/* --- 3. Products Section --- */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Top Products</Text>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.navigate('Products')} // Navigates to the ProductListScreen tab
          >
            <Text style={styles.seeAllText}>See All</Text>
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
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.9}
              style={styles.productCard}
              onPress={() =>
                navigation.navigate('ProductDetail', {
                  productId: item.id,
                  product: item,
                })
              } // Navigates to ProductDetailScreen
            >
              <View style={styles.productImageContainer}>
                <ImageBackground
                  source={{ uri: item.image }}
                  style={styles.productImage}
                />
              </View>
              <View style={styles.productInfo}>
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
          ))}
        </ScrollView>

        {/* --- 4. Services Section --- */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Services</Text>
        </View>
        <View style={styles.servicesGrid}>
          {services.map(service => (
            <TouchableOpacity
              key={service.id}
              activeOpacity={0.7}
              style={styles.serviceItem}
              onPress={() => navigation.navigate(service.route)} // Add this line
            >
              <View
                style={[
                  styles.serviceIconContainer,
                  { backgroundColor: service.color + '15' },
                ]}
              >
                <Icon name={service.icon} size={28} color={service.color} />
              </View>
              <Text style={styles.serviceName}>{service.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  main: { flex: 1, backgroundColor: colors.white }, // Enforced White Background
  scrollContent: { paddingTop: spacing.md },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: spacing.lg,
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.heading,
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
  },
  seeAllText: { ...typography.link, color: colors.primary },

  // Slider Styles
  sliderContainer: { marginBottom: spacing.md },
  bannerSlide: {
    width: BANNER_WIDTH,
    borderRadius: radius.lg,
    padding: spacing.xl,
    justifyContent: 'center',
    height: 160,
    overflow: 'hidden',
    ...shadows.card,
  },
  bannerContent: { zIndex: 2 },
  bannerWelcome: {
    ...typography.caption,
    color: colors.white,
    opacity: 0.8,
    letterSpacing: 1.5,
    fontFamily: 'Poppins-SemiBold',
  },
  bannerTitle: {
    fontSize: 24,
    color: colors.white,
    fontFamily: 'Poppins-Bold',
    marginVertical: 4,
  },
  bannerSubtitle: { ...typography.caption, color: colors.white, opacity: 0.9 },
  bannerIcon: {
    position: 'absolute',
    right: -15,
    bottom: -15,
    transform: [{ scale: 1.8 }],
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
    backgroundColor: colors.border,
    marginHorizontal: 4,
  },
  activeDot: { backgroundColor: colors.primary, width: 20 },

  // Digital Card (Credit Card Style)
  digitalCard: {
    marginHorizontal: spacing.lg,
    borderRadius: radius.lg,
    padding: spacing.xl,
    elevation: 10,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    overflow: 'hidden',
  },
  cardWatermark: {
    position: 'absolute',
    right: -30,
    top: -20,
    opacity: 0.1,
    transform: [{ rotate: '15deg' }],
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  cardLogo: { flexDirection: 'row', alignItems: 'center' },
  logoCircle: {
    backgroundColor: colors.white,
    padding: 4,
    borderRadius: radius.sm,
  },
  cardBrandName: {
    color: colors.white,
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    marginLeft: spacing.sm,
    letterSpacing: 1.5,
  },
  cardMiddleRow: { marginBottom: spacing.lg, marginTop: spacing.sm },
  cardUserId: {
    color: colors.white,
    fontFamily: 'Inter_18pt-Medium',
    fontSize: 22,
    letterSpacing: 3,
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  cardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  cardDateLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 10,
    fontFamily: 'Poppins-SemiBold',
    letterSpacing: 1,
  },
  cardUserName: {
    color: colors.white,
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    marginTop: 2,
    letterSpacing: 1,
  },
  cardDateValue: {
    color: colors.white,
    fontFamily: 'Inter_18pt-Medium',
    fontSize: 16,
    marginTop: 2,
  },

  // Modern Product Cards
  productsScroll: { paddingHorizontal: spacing.lg, gap: spacing.md },
  productCard: {
    width: PRODUCT_CARD_WIDTH,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.card,
    overflow: 'hidden',
  },
  productImageContainer: {
    width: '100%',
    height: 130,
    backgroundColor: colors.surface,
  },
  productImage: { width: '100%', height: '100%' },
  productInfo: { padding: spacing.md },
  productTitle: {
    ...typography.body,
    color: colors.textPrimary,
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
  },
  productPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  productPrice: { ...typography.heading, color: colors.primary, fontSize: 16 },
  addBtn: {
    backgroundColor: colors.black,
    width: 32,
    height: 32,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Services Grid
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginHorizontal: spacing.lg,
    rowGap: spacing.lg,
  },
  serviceItem: { alignItems: 'center', width: '22%' },
  serviceIconContainer: {
    width: 60,
    height: 60,
    borderRadius: radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  serviceName: {
    ...typography.caption,
    fontFamily: 'Inter_18pt-Medium',
    color: colors.textPrimary,
    fontSize: 11,
  },
});
