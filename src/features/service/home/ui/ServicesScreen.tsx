import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { Header } from '@/components/header';
import { colors, spacing, typography, radius, shadows } from '@/theme';

const services = [
  { id: '1', name: 'Products', desc: 'Browse our full catalog of gas stoves and accessories.', icon: 'shopping-bag', color: colors.primary, route: 'Products' },
  { id: '2', name: 'Pipeline Survey', desc: 'Schedule a free pipeline safety inspection.', icon: 'clipboard', color: '#3498DB', route: 'Survey' },
  { id: '3', name: 'Delivery Tracking', desc: 'Track your scheduled cylinder deliveries.', icon: 'truck', color: '#F39C12', route: 'Delivery' },
  { id: '4', name: 'Emergency', desc: '24/7 support for gas leaks and hazards.', icon: 'alert-triangle', color: colors.error, route: 'Emergency' },
];

export const ServicesScreen = () => {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.main}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />
      <Header variant="standard" title="Our Services" rightIcon="search" useTopInset={true} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Emergency Banner */}
        <TouchableOpacity activeOpacity={0.9} onPress={() => navigation.navigate('Emergency')}>
          <LinearGradient colors={['#E74C3C', '#C0392B']} style={styles.emergencyBanner} start={{x:0, y:0}} end={{x:1, y:0}}>
            <View style={styles.emergencyContent}>
              <Text style={styles.emergencyTitle}>Gas Leak Emergency?</Text>
              <Text style={styles.emergencySub}>Tap here for rapid response support.</Text>
            </View>
            <View style={styles.callBtn}>
              <Icon name="phone-call" size={20} color={colors.error} />
            </View>
          </LinearGradient>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>What do you need help with?</Text>

        <View style={styles.grid}>
          {services.map((service) => (
            <TouchableOpacity 
              key={service.id} 
              activeOpacity={0.8} 
              style={styles.serviceCard}
              onPress={() => navigation.navigate(service.route)}
            >
              <View style={[styles.iconBox, { backgroundColor: service.color + '15' }]}>
                <Icon name={service.icon} size={28} color={service.color} />
              </View>
              <Text style={styles.serviceName}>{service.name}</Text>
              <Text style={styles.serviceDesc} numberOfLines={2}>{service.desc}</Text>
            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  main: { flex: 1, backgroundColor: colors.white },
  scrollContent: { padding: spacing.lg, paddingBottom: 100 },
  
  emergencyBanner: { flexDirection: 'row', alignItems: 'center', padding: spacing.lg, borderRadius: radius.lg, marginBottom: spacing.xl, ...shadows.card, shadowColor: colors.error, shadowOpacity: 0.3 },
  emergencyContent: { flex: 1, paddingRight: spacing.md },
  emergencyTitle: { ...typography.bodyLarge, color: colors.white, fontFamily: 'Poppins-Bold' },
  emergencySub: { ...typography.caption, color: colors.white, opacity: 0.9, marginTop: 2 },
  callBtn: { backgroundColor: colors.white, width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },

  sectionTitle: { ...typography.heading, fontFamily: 'Poppins-Bold', fontSize: 18, marginBottom: spacing.md },
  
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: spacing.md },
  serviceCard: { width: '47%', backgroundColor: colors.white, padding: spacing.md, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, ...shadows.card, marginBottom: spacing.xs },
  iconBox: { width: 50, height: 50, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md },
  serviceName: { ...typography.bodyLarge, fontFamily: 'Poppins-SemiBold', marginBottom: 4 },
  serviceDesc: { ...typography.caption, color: colors.textMuted, lineHeight: 16 },
});