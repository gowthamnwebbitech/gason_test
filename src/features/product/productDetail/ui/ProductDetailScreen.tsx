import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { Header } from '@/components/header';
import { colors, spacing, typography, radius, shadows } from '@/theme';

const productDetails = {
  name: 'Eco Burner 3 Premium Stove',
  price: '4500', 
  rating: '4.8',
  reviews: '124',
  description: 'Experience high-efficiency cooking with our Eco Burner 3 Premium Stove. Designed with toughened glass and rust-proof brass burners, it ensures even heat distribution and long-lasting durability. Perfect for modern kitchens.',
  images: [
    'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?q=80&w=800&auto=format&fit=crop', // Sleek Stove
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop', // Modern Kitchen View
    'https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=800&auto=format&fit=crop', // Brass Burner Detail
    'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=800&auto=format&fit=crop', // Appliance texture
  ],
};

export const ProductDetailScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const [activeImage, setActiveImage] = useState(productDetails.images[0]);
  const [quantity, setQuantity] = useState(1);

  return (
    <View style={styles.main}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />
      
      <Header 
        variant="standard" 
        title="Details" 
        rightIcon="heart"
        onRightPress={() => console.log('Added to Wishlist')}
        useTopInset={true}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* --- Image Gallery Layout (Side Thumbnails + Main Image) --- */}
        <View style={styles.galleryContainer}>
          {/* Vertical Thumbnails */}
          <View style={styles.thumbnailList}>
            {productDetails.images.map((img, index) => (
              <TouchableOpacity 
                key={index} 
                onPress={() => setActiveImage(img)}
                style={[
                  styles.thumbnailWrapper, 
                  activeImage === img && styles.activeThumbnailWrapper
                ]}
              >
                <Image source={{ uri: img }} style={styles.thumbnailImage} />
              </TouchableOpacity>
            ))}
          </View>
          
          {/* Main Large Image */}
          <View style={styles.mainImageContainer}>
            <Image source={{ uri: activeImage }} style={styles.mainImage} resizeMode="cover" />
          </View>
        </View>

        {/* --- Product Info Section --- */}
        <View style={styles.infoContainer}>
          <View style={styles.titleRow}>
            <Text style={styles.productTitle}>{productDetails.name}</Text>
          </View>
          
          <View style={styles.ratingRow}>
            <Icon name="star" size={16} color="#F39C12" />
            <Text style={styles.ratingText}>{productDetails.rating}</Text>
            <Text style={styles.reviewText}>({productDetails.reviews} Reviews)</Text>
          </View>

          <Text style={styles.sectionHeading}>Description</Text>
          <Text style={styles.descriptionText}>{productDetails.description}</Text>

          {/* Quantity Selector */}
          <View style={styles.quantityContainer}>
            <Text style={styles.sectionHeading}>Quantity</Text>
            <View style={styles.quantityControls}>
              <TouchableOpacity 
                style={styles.qtyBtn} 
                onPress={() => setQuantity(Math.max(1, quantity - 1))}
              >
                <Icon name="minus" size={18} color={colors.textPrimary} />
              </TouchableOpacity>
              <Text style={styles.qtyText}>{quantity}</Text>
              <TouchableOpacity 
                style={styles.qtyBtn} 
                onPress={() => setQuantity(quantity + 1)}
              >
                <Icon name="plus" size={18} color={colors.textPrimary} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* --- Sticky Add to Cart Bottom Bar --- */}
      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, spacing.md) }]}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Total Price</Text>
          <Text style={styles.totalPrice}>{productDetails.price}</Text>
        </View>
        
        <TouchableOpacity style={styles.addToCartBtn} activeOpacity={0.8}>
          <Icon name="shopping-bag" size={20} color={colors.white} style={{ marginRight: spacing.sm }} />
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  main: { flex: 1, backgroundColor: colors.white },
  scrollContent: { paddingBottom: 120 }, // Leaves room for the fixed bottom bar
  
  // Gallery Layout
  galleryContainer: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    marginTop: spacing.md,
    height: 340,
  },
  thumbnailList: {
    width: 65,
    marginRight: spacing.md,
    justifyContent: 'space-between',
  },
  thumbnailWrapper: {
    width: 65,
    height: 75,
    borderRadius: radius.md,
    borderWidth: 2,
    borderColor: 'transparent',
    overflow: 'hidden',
    backgroundColor: colors.surface,
  },
  activeThumbnailWrapper: {
    borderColor: colors.primary,
  },
  thumbnailImage: { width: '100%', height: '100%' },
  mainImageContainer: {
    flex: 1,
    borderRadius: radius.lg,
    overflow: 'hidden',
    backgroundColor: colors.surface,
    ...shadows.card,
  },
  mainImage: { width: '100%', height: '100%' },

  // Info Section
  infoContainer: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.xl,
  },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  productTitle: { ...typography.heading, fontFamily: 'Poppins-Bold', fontSize: 24, flex: 1, lineHeight: 32 },
  
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.xs, marginBottom: spacing.lg },
  ratingText: { ...typography.bodyLarge, fontFamily: 'Poppins-Bold', marginLeft: spacing.xs },
  reviewText: { ...typography.body, color: colors.textMuted, marginLeft: spacing.xs },

  sectionHeading: { ...typography.bodyLarge, fontFamily: 'Poppins-Bold', marginBottom: spacing.sm },
  descriptionText: { ...typography.body, lineHeight: 24, marginBottom: spacing.xl },

  // Quantity
  quantityContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xl },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.full,
    padding: 4,
  },
  qtyBtn: {
    width: 36,
    height: 36,
    borderRadius: radius.full,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.card,
    shadowOpacity: 0.05,
  },
  qtyText: { ...typography.bodyLarge, fontFamily: 'Poppins-Bold', width: 40, textAlign: 'center' },

  // Bottom Action Bar
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    ...shadows.card,
    shadowOffset: { width: 0, height: -4 }, // Shadow points up
  },
  priceContainer: { flex: 1 },
  priceLabel: { ...typography.caption, color: colors.textMuted, textTransform: 'uppercase' },
  totalPrice: { ...typography.heading, fontFamily: 'Poppins-Bold', fontSize: 24, color: colors.primary },
  
  addToCartBtn: {
    flex: 1.2,
    flexDirection: 'row',
    backgroundColor: colors.black,
    height: 56,
    borderRadius: radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.card,
  },
  addToCartText: { ...typography.buttonPrimary, fontSize: 16 },
});