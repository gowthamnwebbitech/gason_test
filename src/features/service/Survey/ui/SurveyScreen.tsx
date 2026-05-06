import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { Header } from '@/components/header';
import { colors, spacing, typography, radius, shadows } from '@/theme';

export const SurveyScreen = () => {
  const insets = useSafeAreaInsets();
  
  // Dummy State for UI
  const [date, setDate] = useState('24 Oct 2026');
  const [time, setTime] = useState('10:00 AM');

  return (
    <View style={styles.main}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />
      <Header variant="standard" title="Book Survey" showBack={true} useTopInset={true} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        <Text style={styles.screenDesc}>
          Schedule a free pipeline and gas safety inspection with our certified technicians.
        </Text>

        {/* Date & Time Row */}
        <View style={styles.row}>
          <View style={styles.inputContainerHalf}>
            <Text style={styles.inputLabel}>Select Date</Text>
            <TouchableOpacity style={styles.inputBox} activeOpacity={0.7}>
              <Icon name="calendar" size={18} color={colors.primary} />
              <Text style={styles.inputText}>{date}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.inputContainerHalf}>
            <Text style={styles.inputLabel}>Select Time</Text>
            <TouchableOpacity style={styles.inputBox} activeOpacity={0.7}>
              <Icon name="clock" size={18} color={colors.primary} />
              <Text style={styles.inputText}>{time}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Image Upload Box */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Upload Setup Image (Optional)</Text>
          <TouchableOpacity style={styles.uploadBox} activeOpacity={0.7}>
            <View style={styles.uploadIconCircle}>
              <Icon name="camera" size={24} color={colors.primary} />
            </View>
            <Text style={styles.uploadText}>Tap to upload a photo of your pipeline</Text>
            <Text style={styles.uploadSubText}>PNG, JPG up to 5MB</Text>
          </TouchableOpacity>
        </View>

        {/* Description */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Issue Description</Text>
          <TextInput 
            style={[styles.inputBox, styles.textArea]}
            placeholder="Describe any issues or smells..."
            placeholderTextColor={colors.textMuted}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Suggestions */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Any Specific Suggestions?</Text>
          <TextInput 
            style={[styles.inputBox, styles.textArea]}
            placeholder="E.g., Please call before arriving..."
            placeholderTextColor={colors.textMuted}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>

      </ScrollView>

      {/* Sticky Bottom Button */}
      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, spacing.md) }]}>
        <TouchableOpacity style={styles.submitBtn} activeOpacity={0.8}>
          <Text style={styles.submitText}>Confirm Booking</Text>
          <Icon name="check-circle" size={20} color={colors.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  main: { flex: 1, backgroundColor: colors.white },
  scrollContent: { padding: spacing.lg, paddingBottom: 120 },
  screenDesc: { ...typography.body, color: colors.textSecondary, marginBottom: spacing.xl },
  
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.lg },
  inputContainer: { marginBottom: spacing.lg },
  inputContainerHalf: { width: '48%' },
  
  inputLabel: { ...typography.bodyLarge, fontFamily: 'Poppins-SemiBold', marginBottom: spacing.sm, color: colors.textPrimary },
  inputBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, paddingHorizontal: spacing.md, height: 50 },
  inputText: { ...typography.body, marginLeft: spacing.sm, color: colors.textPrimary },
  textArea: { height: 100, paddingTop: spacing.md },

  // Upload Box
  uploadBox: { backgroundColor: colors.primaryLight, borderWidth: 2, borderColor: colors.primary, borderStyle: 'dashed', borderRadius: radius.lg, alignItems: 'center', justifyContent: 'center', paddingVertical: spacing.xl },
  uploadIconCircle: { width: 48, height: 48, borderRadius: 24, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm, ...shadows.card },
  uploadText: { ...typography.bodyLarge, fontFamily: 'Inter_18pt-Medium', color: colors.primaryDark },
  uploadSubText: { ...typography.caption, color: colors.textSecondary, marginTop: 4 },

  // Bottom Bar
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: colors.white, paddingHorizontal: spacing.lg, paddingTop: spacing.md, borderTopWidth: 1, borderTopColor: colors.border, ...shadows.card },
  submitBtn: { flexDirection: 'row', backgroundColor: colors.black, height: 56, borderRadius: radius.xl, alignItems: 'center', justifyContent: 'center' },
  submitText: { ...typography.buttonPrimary, fontSize: 16, marginRight: spacing.sm },
});