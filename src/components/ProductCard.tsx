import React, { memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  StyleProp,
  ViewStyle,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { typography, colors, spacing } from '@/theme';

export interface ProductType {
  id?: number | string;
  product_id?: number | string;
  name: string;
  price: string | number;
  image: string;
}

interface ProductCardProps {
  item: ProductType;
  cardWidth: number;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  showBadge?: boolean;
}

export const ProductCard = memo(({ item, cardWidth, onPress, style, showBadge = false }: ProductCardProps) => {
  const priceLabel = Number(item.price) > 0 ? `₹${item.price}` : 'Free';

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={[styles.card, { width: cardWidth }, style]}
      onPress={onPress}
    >
      <View style={styles.imageContainer}>
        <ImageBackground
          source={{ uri: item.image }}
          style={styles.image}
          resizeMode="cover"
        />
        
        {/* Premium PRO Badge */}
        {showBadge && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>PRO</Text>
          </View>
        )}

        {/* Elegant Favorite Button */}
        <TouchableOpacity style={styles.favoriteBtn} activeOpacity={0.7}>
          <Icon name="heart" size={14} color="#000000" />
        </TouchableOpacity>
      </View>
      
      <View style={styles.infoContainer}>
        <Text style={styles.title} numberOfLines={2}>
          {item.name}
        </Text>
        
        <View style={styles.bottomRow}>
          <Text style={styles.price}>{priceLabel}</Text>
          
          {/* Sleek Action Button */}
          <TouchableOpacity style={styles.addBtn} activeOpacity={0.8}>
            <Icon name="plus" size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}, (prevProps, nextProps) => {
  // Custom comparison to ensure it only re-renders if the ID or width changes
  const prevId = prevProps.item.id || prevProps.item.product_id;
  const nextId = nextProps.item.id || nextProps.item.product_id;
  return prevId === nextId && prevProps.cardWidth === nextProps.cardWidth;
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F0F0F0', // Subtle border for crisp edges
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
    overflow: 'visible',
    marginBottom: spacing.xs,
  },
  imageContainer: {
    width: '100%',
    height: 130, // Perfectly proportioned (Reduced from 160)
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    backgroundColor: '#F4F5F7',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  badge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(0,0,0,0.85)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    ...typography.caption,
    color: '#FFFFFF',
    fontSize: 9,
    fontFamily: typography.screenTitle.fontFamily,
    letterSpacing: 1,
  },
  favoriteBtn: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#FFFFFF',
    width: 28, // Scaled down for elegance
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  infoContainer: {
    padding: 12, // Tighter padding
  },
  title: {
    ...typography.bodyLarge,
    color: '#1A1A1A',
    fontFamily: typography.screenTitle.fontFamily,
    fontSize: 13,
    lineHeight: 18,
    minHeight: 36, // Exact height for 2 lines of text
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  price: {
    ...typography.heading,
    color: '#000000',
    fontSize: 15,
    letterSpacing: -0.5,
  },
  addBtn: {
    backgroundColor: '#000000',
    width: 32, // Sleeker button profile
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
});