import React, { useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, StatusBar, Animated, Easing, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ButtonPrimary } from '@/components/ButtonPrimary';
import { spacing, typography, colors, radius, moderateScale } from '@/theme';
import { images } from '@/assets';
import { useAppDispatch } from '@/store';
import { completeOnboarding } from '../store';

// Get screen height for responsive background elements
const { height } = Dimensions.get('window');

export const WelcomeScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();

  // Animation Refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current; // New: Slide up from 30px
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Parallel entry animations for a smoother, premium feel
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      })
    ]).start();

    // Infinite floating animation for the logo
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, { toValue: 1, duration: 2500, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(floatAnim, { toValue: 0, duration: 2500, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    ).start();
  }, [fadeAnim, slideAnim, floatAnim]);

  const floatInterpolate = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -15], // Slightly gentler float
  });

  const handleGetStarted = async () => {
    await dispatch(completeOnboarding());
    navigation.replace('Login'); 
  };

  return (
    <View style={styles.main}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Subdued Decorative Orbs - Kept ultra-minimal for the clean white aesthetic */}
      <View style={[styles.orb, styles.orbTop]} />
      <View style={[styles.orb, styles.orbBottom]} />

      <View style={[styles.container, { paddingTop: insets.top, paddingBottom: Math.max(insets.bottom, spacing.lg) }]}>
        
        {/* Top Section: Logo */}
        <View style={styles.logoContainer}>
          <Animated.View style={{ transform: [{ translateY: floatInterpolate }] }}>
            <Image source={images.logo} style={styles.logo} />
          </Animated.View>
        </View>

        {/* Bottom Section: Text & Button */}
        <Animated.View 
          style={[
            styles.bottomContent, 
            { 
              opacity: fadeAnim, 
              transform: [{ translateY: slideAnim }] // Apply slide animation
            }
          ]}
        >
          <View style={styles.textWrapper}>
            <Text style={styles.subtitle}>Welcome to</Text>
            <Text style={styles.title}>GASON</Text>
            <Text style={styles.brandExtension}>INDIA LIMITED</Text>
            <Text style={styles.desc}>Precision cooking technology for the modern Indian home.</Text>
          </View>

          <View style={styles.footer}>
            <ButtonPrimary
              title="Get Started"
              onPress={handleGetStarted}
              style={styles.button}
            />
          </View>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#FFFFFF', // Enforcing the crisp white background
  },
  container: {
    flex: 1,
    justifyContent: 'space-between', // Pushes logo up and text/button down
  },
  orb: {
    position: 'absolute',
    width: height * 0.4,
    height: height * 0.4,
    borderRadius: height * 0.2,
    opacity: 0.3,
  },
  orbTop: {
    top: -height * 0.1,
    right: -height * 0.1,
    backgroundColor: colors.primary + '08', // Faint hex transparency
  },
  orbBottom: {
    bottom: -height * 0.1,
    left: -height * 0.1,
    backgroundColor: '#F8F8F8', // Barely visible against the white
  },
  logoContainer: {
    flex: 1.2, // Gives slightly more room to the top half
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: { 
    width: moderateScale(220), // Scaled down from 260 to prevent overlap on small devices
    height: moderateScale(220), 
    resizeMode: 'contain',
  },
  bottomContent: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: spacing.lg,
  },
  textWrapper: {
    alignItems: 'center',
    marginBottom: spacing.xxl, // Replaces rigid footer padding
  },
  subtitle: {
    ...typography.body,
    fontSize: moderateScale(12),
    letterSpacing: 4,
    textTransform: 'uppercase',
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  title: { 
    ...typography.screenTitle,
    fontSize: moderateScale(48), // Adjusted down slightly so it doesn't break to a new line
    fontFamily: 'Poppins-Bold',
    letterSpacing: -1.5,
    color: colors.textPrimary,
    lineHeight: moderateScale(56),
  },
  brandExtension: {
    ...typography.bodyLarge,
    fontSize: moderateScale(13),
    fontFamily: 'Poppins-SemiBold',
    letterSpacing: 6,
    color: colors.primary,
    marginBottom: spacing.lg,
  },
  desc: {
    ...typography.body,
    fontSize: moderateScale(15),
    textAlign: 'center',
    color: colors.textSecondary,
    paddingHorizontal: spacing.md,
    lineHeight: 24,
  },
  footer: { 
    width: '100%',
    paddingTop: spacing.sm,
  },
  button: { 
    height: 60,
    borderRadius: radius.full, 
    backgroundColor: colors.textPrimary, // Typically a stark dark color looks best on white
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5, // Android shadow support
  },
});