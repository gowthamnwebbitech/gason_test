import React, { useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, StatusBar, Animated, Easing } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { ButtonPrimary } from '@/components/ButtonPrimary';
import { spacing, typography, colors, radius, moderateScale } from '@/theme';
import { images } from '@/assets';
import { useAppDispatch } from '@/store';
import { completeOnboarding } from '../store';

export const WelcomeScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();

  // Animation Refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade-in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    // Infinite floating animation for the logo
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, { toValue: 1, duration: 2000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
        Animated.timing(floatAnim, { toValue: 0, duration: 2000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const floatInterpolate = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -20],
  });

  const handleGetStarted = async () => {
    await dispatch(completeOnboarding());
    navigation.replace('Login'); 
  };

  return (
    <View style={styles.main}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* CREATIVE BACKGROUND ORBS */}
      <View style={[styles.orb, styles.orbTop]} />
      <View style={[styles.orb, styles.orbBottom]} />

      <View style={[styles.content, { marginTop: insets.top }]}>
        {/* Floating Animated Logo */}
        <Animated.View style={{ transform: [{ translateY: floatInterpolate }] }}>
          <Image source={images.logo} style={styles.logo} />
        </Animated.View>
        
        <Animated.View style={[styles.textWrapper, { opacity: fadeAnim }]}>
          <Text style={styles.subtitle}>Welcome to</Text>
          <Text style={styles.title}>GASON</Text>
          <Text style={styles.brandExtension}>INDIA LIMITED</Text>
          <Text style={styles.desc}>Precision cooking technology for the modern Indian home.</Text>
        </Animated.View>
      </View>

      <Animated.View style={[styles.footer, { opacity: fadeAnim, paddingBottom: Math.max(insets.bottom, spacing.md) }]}>
        <ButtonPrimary
          title="Get Started"
          onPress={handleGetStarted}
          style={styles.button}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#FFFFFF', 
  },
  orb: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    opacity: 0.5,
  },
  orbTop: {
    top: -50,
    right: -100,
    backgroundColor: colors.primary + '10',
  },
  orbBottom: {
    bottom: -50,
    left: -100,
    backgroundColor: '#F0F0F0',
  },
  content: { 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  logo: { 
    width: moderateScale(260), 
    height: moderateScale(260), 
    resizeMode: 'contain',
    marginBottom: spacing.md,
  },
  textWrapper: {
    alignItems: 'center',
  },
  subtitle: {
    ...typography.body,
    fontSize: moderateScale(12),
    letterSpacing: 6,
    textTransform: 'uppercase',
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  title: { 
    ...typography.screenTitle,
    fontSize: moderateScale(56),
    fontFamily: 'Poppins-Bold',
    letterSpacing: -2,
    color: colors.textPrimary,
  },
  brandExtension: {
    ...typography.bodyLarge,
    fontSize: moderateScale(14),
    fontFamily: 'Poppins-SemiBold',
    letterSpacing: 8,
    color: colors.primary,
    marginBottom: spacing.xl,
  },
  desc: {
    ...typography.body,
    fontSize: moderateScale(15),
    textAlign: 'center',
    color: colors.textSecondary,
    maxWidth: '85%',
    lineHeight: 24,
  },
  footer: { 
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
  },
  button: { 
    height: 60,
    borderRadius: radius.full, // Ultra-rounded pill shape
    backgroundColor: colors.black,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
});