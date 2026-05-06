import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { Header } from '@/components/header';
import { colors, spacing, typography, radius, shadows } from '@/theme';

export const DeliveryScreen = () => {
  const insets = useSafeAreaInsets();
  const [suggestion, setSuggestion] = useState('');

  return (
    <View style={styles.main}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />
      <Header variant="standard" title="Track Delivery" showBack={true} useTopInset={true} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* --- Mock Map Area --- */}
        {/* <View style={styles.mapPlaceholder}>
          <Icon name="map" size={48} color={colors.border} style={{ opacity: 0.5 }} />
          <Text style={styles.mapText}>Live Tracking Map View</Text>
          

          <View style={styles.routeLine} />
          <View style={styles.routeDotStart} />
          <View style={styles.routeDotEnd}>
            <View style={styles.routeDotEndInner} />
          </View>
        </View> */}

        {/* --- ETA Status Card --- */}
        <View style={styles.etaCard}>
          <View style={styles.etaLeft}>
            <Text style={styles.etaLabel}>Estimated Arrival</Text>
            <Text style={styles.etaTime}>Today, 4:30 PM</Text>
            <Text style={styles.etaStatus}>Out for delivery</Text>
          </View>
          <View style={styles.etaIconBox}>
            <Icon name="truck" size={28} color={colors.white} />
          </View>
        </View>

        {/* --- Driver Details --- */}
        <Text style={styles.sectionTitle}>Delivery Agent</Text>
        <View style={styles.driverCard}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200&auto=format&fit=crop' }} 
            style={styles.driverAvatar} 
          />
          <View style={styles.driverInfo}>
            <Text style={styles.driverName}>Ramesh Kumar</Text>
            <View style={styles.ratingRow}>
              <Icon name="star" size={14} color="#F39C12" />
              <Text style={styles.ratingText}>4.8 Rating</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.callBtn} activeOpacity={0.7}>
            <Icon name="phone" size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* --- Delivery Address --- */}
        <Text style={styles.sectionTitle}>Delivery Location</Text>
        <View style={styles.addressCard}>
          <View style={styles.addressIconBox}>
            <Icon name="map-pin" size={20} color={colors.white} />
          </View>
          <View style={styles.addressInfoBox}>
            <Text style={styles.addressName}>Home</Text>
            <Text style={styles.addressText}>124, Gason Tech Park, RS Puram</Text>
            <Text style={styles.addressText}>Coimbatore, Tamil Nadu 641002</Text>
          </View>
        </View>

        {/* --- Delivery Suggestions / Instructions --- */}
        <Text style={styles.sectionTitle}>Delivery Instructions</Text>
        <View style={styles.inputContainer}>
          <TextInput 
            style={styles.textArea}
            placeholder="E.g., Leave at the security gate, please call when near..."
            placeholderTextColor={colors.textMuted}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            value={suggestion}
            onChangeText={setSuggestion}
          />
        </View>

      </ScrollView>

      {/* Sticky Bottom Action */}
      <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, spacing.md) }]}>
        <TouchableOpacity style={styles.submitBtn} activeOpacity={0.8}>
          <Text style={styles.submitText}>Save Instructions</Text>
          <Icon name="check" size={20} color={colors.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  main: { flex: 1, backgroundColor: colors.white },
  scrollContent: { padding: spacing.lg, paddingBottom: 120 },
  
  // Map Placeholder
  mapPlaceholder: { width: '100%', height: 180, backgroundColor: colors.surface, borderRadius: radius.lg, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.xl, position: 'relative', overflow: 'hidden', borderWidth: 1, borderColor: colors.border },
  mapText: { ...typography.caption, color: colors.textMuted, marginTop: spacing.sm },
  routeLine: { position: 'absolute', width: '60%', height: 4, backgroundColor: colors.primaryLight, borderRadius: 2, transform: [{ rotate: '15deg' }] },
  routeDotStart: { position: 'absolute', left: '20%', top: '60%', width: 12, height: 12, borderRadius: 6, backgroundColor: colors.textMuted },
  routeDotEnd: { position: 'absolute', right: '20%', top: '35%', width: 24, height: 24, borderRadius: 12, backgroundColor: colors.primaryLight, alignItems: 'center', justifyContent: 'center' },
  routeDotEndInner: { width: 12, height: 12, borderRadius: 6, backgroundColor: colors.primary },

  // ETA Card
  etaCard: { flexDirection: 'row', backgroundColor: colors.white, padding: spacing.lg, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, ...shadows.card, marginBottom: spacing.xl, alignItems: 'center', justifyContent: 'space-between' },
  etaLeft: { flex: 1 },
  etaLabel: { ...typography.caption, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: 1 },
  etaTime: { ...typography.heading, fontFamily: 'Poppins-Bold', fontSize: 24, color: colors.primary, marginVertical: 2 },
  etaStatus: { ...typography.bodyLarge, fontFamily: 'Inter_18pt-Medium', color: colors.textPrimary },
  etaIconBox: { width: 60, height: 60, borderRadius: radius.full, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', ...shadows.card, shadowColor: colors.primary },

  sectionTitle: { ...typography.bodyLarge, fontFamily: 'Poppins-Bold', marginBottom: spacing.md, color: colors.textPrimary },

  // Driver Card
  driverCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, padding: spacing.md, borderRadius: radius.lg, marginBottom: spacing.xl },
  driverAvatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: colors.border },
  driverInfo: { flex: 1, marginLeft: spacing.md },
  driverName: { ...typography.bodyLarge, fontFamily: 'Poppins-SemiBold' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  ratingText: { ...typography.caption, color: colors.textSecondary, marginLeft: 4 },
  callBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center', ...shadows.card },

  // Address Card
  addressCard: { flexDirection: 'row', backgroundColor: colors.white, padding: spacing.md, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, ...shadows.card, alignItems: 'flex-start', marginBottom: spacing.xl },
  addressIconBox: { width: 40, height: 40, borderRadius: radius.full, backgroundColor: colors.black, alignItems: 'center', justifyContent: 'center', marginRight: spacing.md },
  addressInfoBox: { flex: 1 },
  addressName: { ...typography.bodyLarge, fontFamily: 'Poppins-Bold', marginBottom: 2 },
  addressText: { ...typography.caption, color: colors.textSecondary, lineHeight: 18 },

  // Instructions Input
  inputContainer: { marginBottom: spacing.lg },
  textArea: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, padding: spacing.md, height: 100, color: colors.textPrimary, ...typography.body },

  // Bottom Bar
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: colors.white, paddingHorizontal: spacing.lg, paddingTop: spacing.md, borderTopWidth: 1, borderTopColor: colors.border, ...shadows.card },
  submitBtn: { flexDirection: 'row', backgroundColor: colors.black, height: 56, borderRadius: radius.xl, alignItems: 'center', justifyContent: 'center' },
  submitText: { ...typography.buttonPrimary, fontSize: 16, marginRight: spacing.sm },
});