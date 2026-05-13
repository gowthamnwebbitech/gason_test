import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { colors, spacing, typography, radius } from '@/theme';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface OutlineProps {
  title: string;
  onPress?: () => void;
  icon?: 'facebook' | 'google';
  disabled?: boolean;
}

export const ButtonOutline = ({ title, onPress, icon }: OutlineProps) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <View style={styles.content}>
        {icon === 'facebook' && (
          <Icon name="facebook" size={24} color="#1877F2" style={styles.icon} />
        )}
        {icon === 'google' && (
          <Icon name="google" size={22} color="#DB4437" style={styles.icon} />
        )}
        <Text style={styles.text}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.xl,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: spacing.xs,
    backgroundColor: colors.white,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: spacing.sm,
  },
  text: {
    ...typography.bodyLarge, // Uses Inter_18pt-Medium
    color: colors.textSecondary,
  },
});