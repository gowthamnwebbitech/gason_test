import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Platform, 
  TextInput, 
  StatusBar,
  StyleProp, // Added this
  ViewStyle  // Added this
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';
import { colors, spacing, typography, radius, shadows } from '@/theme';

export interface HeaderProps {
  variant?: 'main' | 'standard' | 'search';
  title?: string;
  userName?: string;
  searchValue?: string;
  searchPlaceholder?: string;
  showBack?: boolean;
  rightIcon?: string;
  onRightPress?: () => void;
  onBackPress?: () => void;
  onSearchChange?: (text: string) => void;
  useTopInset?: boolean; 
  style?: StyleProp<ViewStyle>; // Added this line to fix the TypeScript error
}

export const Header = ({
  variant = 'standard',
  title,
  userName = 'Surendhar',
  searchValue,
  searchPlaceholder = 'Search...',
  showBack = true,
  rightIcon,
  onRightPress,
  onBackPress,
  onSearchChange,
  useTopInset = true, 
  style, // Destructured the new style prop here
}: HeaderProps) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  
  // Bulletproof calculation for status bar height across iOS (Notch/Island) and Android (Hole-punch/Standard)
  const topPadding = useTopInset 
    ? Math.max(insets.top, Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 20) 
    : 0;

  const handleBack = () => {
    if (onBackPress) onBackPress();
    else if (navigation.canGoBack()) navigation.goBack();
  };

  // Shared wrapper with gradient
  const renderContent = () => {
    if (variant === 'main') {
      return (
        <View style={styles.headerContent}>
          <View style={styles.mainLeft}>
            <Text style={styles.welcomeLabel}>WELCOME BACK !</Text>
            <Text style={styles.userName} numberOfLines={1}>{userName}</Text>
          </View>
          <TouchableOpacity onPress={onRightPress} activeOpacity={0.7} style={styles.iconBtn}>
            <Icon name={rightIcon || 'bell'} size={22} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>
      );
    }

    if (variant === 'search') {
      return (
        <View style={styles.headerContent}>
          {showBack && (
            <TouchableOpacity onPress={handleBack} activeOpacity={0.7} style={styles.sideSlot}>
              <Icon name="arrow-left" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
          )}
          <View style={styles.searchContainer}>
            <Icon name="search" size={18} color={colors.textMuted} style={styles.searchIcon} />
            <TextInput
              value={searchValue}
              onChangeText={onSearchChange}
              placeholder={searchPlaceholder}
              placeholderTextColor={colors.textMuted}
              style={styles.searchInput}
              autoCorrect={false}
            />
          </View>
          <TouchableOpacity onPress={onRightPress} activeOpacity={0.7} style={[styles.sideSlot, styles.rightSlot]}>
            <Icon name={rightIcon || 'sliders'} size={24} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.headerContent}>
        <View style={styles.sideSlot}>
          {showBack && (
            <TouchableOpacity onPress={handleBack} activeOpacity={0.7}>
              <Icon name="arrow-left" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
        </View>
        <View style={[styles.sideSlot, styles.rightSlot]}>
          {(rightIcon || onRightPress) && (
            <TouchableOpacity onPress={onRightPress} activeOpacity={0.7}>
              <Icon name={rightIcon || 'more-vertical'} size={24} color={colors.textPrimary} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <LinearGradient
      colors={[colors.primaryLight, colors.white]} 
      // Applied the custom style array here at the end so it overrides defaults if needed
      style={[styles.container, { paddingTop: topPadding + spacing.sm }, style]} 
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      {renderContent()}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.03)',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 44,
  },
  mainLeft: { flex: 1, justifyContent: 'center' },
  welcomeLabel: { ...typography.caption, fontSize: 10, textTransform: 'uppercase', color: colors.textSecondary },
  userName: { ...typography.bodyLarge, fontFamily: 'Poppins-Bold', marginTop: 2, color: colors.textPrimary },
  iconBtn: { backgroundColor: colors.white, padding: 8, borderRadius: radius.full, ...shadows.card },
  searchContainer: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white, borderRadius: radius.md, paddingHorizontal: spacing.sm, height: 44, marginHorizontal: spacing.sm, ...shadows.card, shadowOpacity: 0.04 },
  searchIcon: { marginRight: spacing.xs },
  searchInput: { flex: 1, ...typography.body, color: colors.textPrimary, paddingVertical: 0 },
  sideSlot: { width: 40, justifyContent: 'center', alignItems: 'flex-start', zIndex: 2 },
  rightSlot: { alignItems: 'flex-end' },
  titleContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { ...typography.heading, fontFamily: 'Poppins-Bold', fontSize: 20, color: colors.textPrimary },
});