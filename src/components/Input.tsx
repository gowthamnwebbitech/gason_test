import React, { useState } from 'react';
import { 
  View, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  TextInputProps,
  StyleProp,
  ViewStyle
} from 'react-native';
import { colors, spacing, radius, typography } from '@/theme';
import Icon from 'react-native-vector-icons/Feather';

// 1. Define strict props so the component knows about 'hasError'
interface InputProps extends TextInputProps {
  isPassword?: boolean;
  hasError?: boolean;
  containerStyle?: StyleProp<ViewStyle>; // Allow layout overrides
}

export const Input: React.FC<InputProps> = ({ 
  isPassword = false, 
  hasError = false, 
  containerStyle,
  style, 
  ...props 
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const shouldSecureText = isPassword && !isPasswordVisible;

  // 2. Dynamic Border Logic (Error > Focused > Default)
  let currentBorderColor = colors.border || '#E5E7EB'; 
  if (hasError) {
    currentBorderColor = colors.error || '#FF3B30'; // GUARANTEED RED ON ERROR
  } else if (isFocused) {
    currentBorderColor = colors.primary || '#007AFF'; // Primary color when typing
  }

  return (
    <View 
      style={[
        styles.wrapper, 
        { borderColor: currentBorderColor }, // Apply dynamic border color
        hasError && styles.wrapperError,     // Add subtle red background if error
        containerStyle,
        style 
      ]}
    >
      <TextInput
        {...props}
        secureTextEntry={shouldSecureText}
        placeholderTextColor={colors.textMuted || '#9CA3AF'}
        onFocus={(e) => {
          setIsFocused(true);
          if (props.onFocus) props.onFocus(e); 
        }}
        onBlur={(e) => {
          setIsFocused(false);
          if (props.onBlur) props.onBlur(e);
        }}
        style={styles.input}
      />
      
      {isPassword && (
        <TouchableOpacity 
          onPress={() => setIsPasswordVisible(!isPasswordVisible)}
          style={styles.iconContainer}
          activeOpacity={0.7}
        >
          <Icon 
            name={isPasswordVisible ? "eye" : "eye-off"} 
            size={20} 
            // 3. Make the icon red if there is an error
            color={hasError ? (colors.error || '#FF3B30') : (colors.textSecondary || '#6B7280')} 
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: radius.lg, 
    paddingHorizontal: spacing.md,
    marginVertical: spacing.xs,
    backgroundColor: '#FFFFFF', // Guaranteed strict white background
    height: 56, 
  },
  wrapperError: {
    backgroundColor: '#FFF5F5', // Very light red tint when an error occurs
  },
  input: {
    flex: 1,
    ...typography.bodyLarge, 
    color: colors.textPrimary || '#111827',
    height: '100%', 
  },
  iconContainer: {
    marginLeft: spacing.sm,
    padding: spacing.xs, // Increases the physical tap area for the thumb
  },
});