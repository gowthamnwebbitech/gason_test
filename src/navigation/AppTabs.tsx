import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Feather';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppTabsParamList } from './types';
import { colors, shadows } from '@/theme';
import { useAppSelector } from '@/store';

// Member Screens
import { MemberDashboardScreen } from '@/features/member/dashboard/MemberDashboardScreen';
import { MemberProfileScreen } from '@/features/member/memberProfile/MemberProfileScreen';

// Standard Screens
import { ProductListScreen } from '@/features/product/productList/ui/ProductListScreen';
import { CartScreen } from '@/features/cart/ui/CartScreen';
import { ServicesScreen } from '@/features/service/home/ui/ServicesScreen';
import { ProfileScreen } from '@/features/profile/ui/ProfileScreen';
import { HomeScreen } from '@/features/home/ui/HomeScreen';

const Tab = createBottomTabNavigator<AppTabsParamList>();

function CustomTabBar({ state, descriptors, navigation }: any) {
  const insets = useSafeAreaInsets();
  const safeBottomPadding = Math.max(insets.bottom, 16);

  return (
    <View style={[styles.tabBar, { paddingBottom: safeBottomPadding }]}>
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;
        const isCart = route.name === 'Cart';

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        // --- UPDATED ICON LOGIC ---
        let iconName = 'home'; // Defaults to 'home' for 'Home' and 'MemberHome'
        if (route.name === 'Products') iconName = 'grid';
        if (route.name === 'Cart') iconName = 'shopping-bag';
        if (route.name === 'Services') iconName = 'briefcase';
        if (route.name === 'Profile' || route.name === 'MemberProfile') iconName = 'user';

        return (
          <TouchableOpacity
            key={index}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            onPress={onPress}
            style={[styles.tabItem, isCart && styles.cartTabItem]}
            activeOpacity={0.8}
          >
            {isCart ? (
              <View style={styles.floatingCartBtn}>
                <Icon name={iconName} size={24} color={colors.white} />
              </View>
            ) : (
              <View style={styles.iconContainer}>
                <Icon 
                  name={iconName} 
                  size={24} 
                  color={isFocused ? colors.primary : colors.textMuted} 
                />
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export const AppTabs = () => {
  const user = useAppSelector((state) => state.auth.user);
  const role = user?.role || 'user'; 

  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }} 
    >
      {role === 'member' ? (
        // MEMBER TABS
        <>
          <Tab.Screen name="MemberHome" component={MemberDashboardScreen} />
          <Tab.Screen name="MemberProfile" component={MemberProfileScreen} />
        </>
      ) : (
        // USER TABS
        <>
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Products" component={ProductListScreen} />
          <Tab.Screen name="Cart" component={CartScreen} />
          <Tab.Screen name="Services" component={ServicesScreen} />
          <Tab.Screen name="Profile" component={ProfileScreen} />
        </>
      )}
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF', // Strict pure white
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    ...shadows.card,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartTabItem: {
    justifyContent: 'flex-start',
  },
  iconContainer: {
    padding: 8,
  },
  floatingCartBtn: {
    backgroundColor: colors.black,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -35, 
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
});