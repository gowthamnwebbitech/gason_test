import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';

import { ButtonPrimary } from '@/components/ButtonPrimary';
import { colors, spacing, typography, radius, shadows } from '@/theme';

export const SuccessScreen = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  
  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(60)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  return (
    <View style={[styles.main, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      {/* LUXURY ATMOSPHERIC GLOW */}
      <View style={styles.glow} />

      <View style={styles.content}>
        <Animated.View style={[
          styles.illustrationContainer, 
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
        ]}>
          <View style={styles.outerRing}>
            <View style={styles.innerRing}>
              <View style={styles.iconContainer}>
                <Icon name="check" size={48} color={colors.white} />
              </View>
            </View>
          </View>
        </Animated.View>

        <Animated.View style={[
          styles.textContainer, 
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
        ]}>
          <Text style={styles.title}>Password Reset</Text>
          <Text style={styles.subtitle}>Success!</Text>
          <Text style={styles.description}>
            Your account credentials have been updated securely. You can now log in to continue your journey.
          </Text>
        </Animated.View>
      </View>

      <Animated.View style={[styles.footer, { opacity: fadeAnim }]}>
        <ButtonPrimary 
          title="Sign in to your account" 
          onPress={() => navigation.navigate('Login')} 
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
  glow: {
    position: 'absolute',
    top: -50,
    alignSelf: 'center',
    width: 300,
    height: 300,
    backgroundColor: colors.primary + '08', 
    borderRadius: 150,
  },
  content: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    paddingHorizontal: spacing.xl 
  },
  illustrationContainer: { 
    marginBottom: spacing.xxl 
  },
  
  // Luxury Ring Design
  outerRing: { 
    width: 160, 
    height: 160, 
    backgroundColor: colors.primary + '10', 
    borderRadius: 80, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  innerRing: { 
    width: 110, 
    height: 110, 
    backgroundColor: colors.primary + '20', 
    borderRadius: 55, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  iconContainer: { 
    width: 70, 
    height: 70, 
    backgroundColor: colors.primary, 
    borderRadius: 35, 
    justifyContent: 'center', 
    alignItems: 'center',
    ...shadows.card,
    shadowColor: colors.primary,
    shadowOpacity: 0.4,
  },
  
  textContainer: {
    alignItems: 'center',
    maxWidth: '90%',
  },
  title: { 
    ...typography.bodyLarge,
    fontSize: 16,
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: colors.primary,
    fontWeight: '800',
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.screenTitle,
    fontSize: 38,
    color: '#111827',
    marginBottom: spacing.md,
    letterSpacing: -1,
  },
  description: { 
    ...typography.bodyLarge, 
    textAlign: 'center', 
    color: colors.textSecondary, 
    lineHeight: 26,
  },
  
  footer: { 
    paddingHorizontal: spacing.lg, 
    marginBottom: spacing.md 
  },
  button: { 
    borderRadius: radius.xl,
    height: 58,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
  }
});