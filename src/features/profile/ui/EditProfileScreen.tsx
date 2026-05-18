import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, StatusBar, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { Header } from '@/components/header';
import { colors, spacing, typography, radius, shadows } from '@/theme';

export const EditProfileScreen = () => {
  const insets = useSafeAreaInsets();
  const [name, setName] = useState('Mr. J. Bala Vijai Kumar');
  const [email, setEmail] = useState('balavijai@webbitech.com');
  const [phone, setPhone] = useState('+91 98765 43210');

  return (
    <View style={styles.main}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />
      <Header variant="standard" title="Edit Profile" showBack={true} useTopInset={true} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.avatarSection}>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200&auto=format&fit=crop' }} style={styles.avatar} />
            <TouchableOpacity style={styles.cameraBtn}>
              <Icon name="camera" size={16} color={colors.white} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Full Name</Text>
          <TextInput style={styles.inputBox} value={name} onChangeText={setName} />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Email Address</Text>
          <TextInput style={styles.inputBox} value={email} onChangeText={setEmail} keyboardType="email-address" />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Phone Number</Text>
          <TextInput style={styles.inputBox} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
        </View>
      </ScrollView>

      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, spacing.md) }]}>
        <TouchableOpacity style={styles.saveBtn} activeOpacity={0.8}>
          <Text style={styles.saveText}>Save Changes</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  main: { flex: 1, backgroundColor: colors.white },
  scrollContent: { padding: spacing.lg, paddingBottom: 100 },
  avatarSection: { alignItems: 'center', marginBottom: spacing.xl },
  avatarContainer: { position: 'relative' },
  avatar: { width: 120, height: 120, borderRadius: 60, backgroundColor: colors.surface },
  cameraBtn: { position: 'absolute', bottom: 0, right: 0, backgroundColor: colors.primary, width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: colors.white },
  inputContainer: { marginBottom: spacing.lg },
  inputLabel: { ...typography.bodyLarge, fontFamily: 'Poppins-SemiBold', marginBottom: spacing.sm },
  inputBox: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, paddingHorizontal: spacing.md, height: 50, ...typography.bodyLarge, color: colors.textPrimary },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: colors.white, paddingHorizontal: spacing.lg, paddingTop: spacing.md, borderTopWidth: 1, borderTopColor: colors.border, ...shadows.card },
  saveBtn: { backgroundColor: colors.black, height: 56, borderRadius: radius.xl, alignItems: 'center', justifyContent: 'center' },
  saveText: { ...typography.buttonPrimary, fontSize: 16 },
});