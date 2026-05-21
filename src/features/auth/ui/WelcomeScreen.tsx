import React from 'react';
import { View, Text, Image, StyleSheet, StatusBar } from 'react-native';
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

  const handleGetStarted = async () => {
    await dispatch(completeOnboarding());
    navigation.replace('Login'); 
  };

  return (
    <View style={styles.main}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Decorative Gradient Background */}
      <LinearGradient 
        colors={['rgba(0, 194, 111, 0.03)', 'transparent']} 
        style={styles.gradient} 
      />

      <View style={[styles.content, { marginTop: insets.top }]}>
        {/* Large Brand Visual */}
        <Image source={images.logo} style={styles.logo} />
        
        <View style={styles.textWrapper}>
          <Text style={styles.subtitle}>Welcome to</Text>
          <Text style={styles.title}>GASON</Text>
          <Text style={styles.brandExtension}>INDIA LIMITED</Text>
          <Text style={styles.desc}>Precision cooking technology for the modern Indian home.</Text>
        </View>
      </View>

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, spacing.md) }]}>
        <ButtonPrimary
          title="Get Started"
          onPress={handleGetStarted}
          style={styles.button}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#FFFFFF', // Strict White Background
  },
  gradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '60%',
  },
  content: { 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  logo: { 
    width: moderateScale(220), 
    height: moderateScale(220), 
    resizeMode: 'contain',
    marginBottom: spacing.md,
  },
  textWrapper: {
    alignItems: 'center',
  },
  subtitle: {
    ...typography.body,
    fontSize: moderateScale(14),
    letterSpacing: 4,
    textTransform: 'uppercase',
    color: colors.textMuted,
    marginBottom: spacing.xs,
  },
  title: { 
    ...typography.screenTitle,
    fontSize: moderateScale(48),
    fontFamily: 'Poppins-Bold',
    letterSpacing: -1,
    color: colors.textPrimary,
  },
  brandExtension: {
    ...typography.bodyLarge,
    fontSize: moderateScale(16),
    fontFamily: 'Poppins-SemiBold',
    letterSpacing: 6,
    color: colors.primary,
    marginBottom: spacing.md,
  },
  desc: {
    ...typography.body,
    fontSize: moderateScale(14),
    textAlign: 'center',
    color: colors.textSecondary,
    maxWidth: '80%',
    lineHeight: 22,
  },
  footer: { 
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.md,
  },
  button: { 
    height: 58,
    borderRadius: radius.xl,
    backgroundColor: colors.black,
  },
});