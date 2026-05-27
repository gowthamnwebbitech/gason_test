import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import Toast from 'react-native-toast-message';

import { useAppSelector } from '@/store';
import { colors, typography, spacing, radius, shadows } from '@/theme';
import { ButtonPrimary } from '@/components/ButtonPrimary';
import { withRoleGuard } from '@/components/hoc/withRoleGuard';

// --- MOCK DATA INTERFACES ---
interface Ticket {
  id: string;
  title: string;
  location: string;
  date: string;
  status: 'Open' | 'In Progress' | 'Resolved';
}

const CHECKLIST_ITEMS = [
  { id: 'c1', label: 'Initial Inspection Completed' },
  { id: 'c2', label: 'Safety Protocols Verified' },
  { id: 'c3', label: 'Hardware Replaced/Repaired' },
  { id: 'c4', label: 'System Reboot & Test' },
];

const MOCK_TICKETS: Ticket[] = [
  { id: 'TCK-8091', title: 'Network Outage Reporting', location: 'Block A, Server Room', date: 'Today, 10:30 AM', status: 'Open' },
  { id: 'TCK-8092', title: 'Hardware Replacement', location: 'Main Office', date: 'Yesterday', status: 'In Progress' },
  { id: 'TCK-8088', title: 'System Diagnostic', location: 'Branch 2', date: 'May 25, 2026', status: 'Resolved' },
];

const DashboardComponent = () => {
  const insets = useSafeAreaInsets();
  const user = useAppSelector((state) => state.auth.user);

  // --- STATE ---
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [images, setImages] = useState<string[]>([]); // Array of image URIs
  const [selectedChecks, setSelectedChecks] = useState<string[]>([]);
  const [description, setDescription] = useState('');

  // --- LOGIC ---
  const handleOpenTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setImages([]);
    setSelectedChecks([]);
    setDescription('');
  };

  const handleCloseModal = () => {
    setSelectedTicket(null);
  };

  const toggleChecklist = (id: string) => {
    setSelectedChecks((prev) =>
      prev.includes(id) ? prev.filter((checkId) => checkId !== id) : [...prev, id]
    );
  };

  const handleMockImageUpload = () => {
    if (images.length >= 4) {
      Toast.show({ type: 'error', text1: 'Limit Reached', text2: 'You can only upload up to 4 images.' });
      return;
    }
    // Note: Replace this with actual Image Picker logic
    const mockImageUri = 'https://via.placeholder.com/150/E6F7F0/00C26F?text=Proof';
    setImages([...images, mockImageUri]);
  };

  const handleSubmitReport = () => {
    if (images.length === 0) {
      Toast.show({ type: 'error', text1: 'Required', text2: 'Please upload at least 1 image.' });
      return;
    }
    if (selectedChecks.length === 0) {
      Toast.show({ type: 'error', text1: 'Required', text2: 'Please complete the checklist.' });
      return;
    }
    if (!description.trim()) {
      Toast.show({ type: 'error', text1: 'Required', text2: 'Please provide a description.' });
      return;
    }

    Toast.show({ type: 'success', text1: 'Report Submitted', text2: `Ticket ${selectedTicket?.id} updated successfully.` });
    handleCloseModal();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return colors.error;
      case 'In Progress': return colors.warning;
      case 'Resolved': return colors.success;
      default: return colors.textMuted;
    }
  };

  return (
    <View style={styles.container}>
      {/* --- DASHBOARD HEADER --- */}
      <View style={[styles.header, { paddingTop: insets.top + spacing.lg }]}>
        <View>
          <Text style={styles.greeting}>My Tickets</Text>
          <Text style={styles.subtitle}>Welcome back, {user?.name?.split(' ')[0]}</Text>
        </View>
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarText}>{user?.name?.charAt(0).toUpperCase() || 'M'}</Text>
        </View>
      </View>

      {/* --- TICKET LIST --- */}
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {MOCK_TICKETS.map((ticket) => (
          <TouchableOpacity
            key={ticket.id}
            style={styles.ticketCard}
            activeOpacity={0.7}
            onPress={() => handleOpenTicket(ticket)}
          >
            <View style={styles.ticketHeader}>
              <Text style={styles.ticketId}>{ticket.id}</Text>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(ticket.status) + '15' }]}>
                <View style={[styles.statusDot, { backgroundColor: getStatusColor(ticket.status) }]} />
                <Text style={[styles.statusText, { color: getStatusColor(ticket.status) }]}>{ticket.status}</Text>
              </View>
            </View>
            
            <Text style={styles.ticketTitle}>{ticket.title}</Text>
            
            <View style={styles.ticketFooter}>
              <View style={styles.footerItem}>
                <Icon name="map-pin" size={14} color={colors.textMuted} />
                <Text style={styles.footerText}>{ticket.location}</Text>
              </View>
              <View style={styles.footerItem}>
                <Icon name="calendar" size={14} color={colors.textMuted} />
                <Text style={styles.footerText}>{ticket.date}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* --- TICKET DETAIL FULLSCREEN MODAL --- */}
      <Modal visible={!!selectedTicket} animationType="slide" presentationStyle="pageSheet">
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.modalContainer}>
          
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={handleCloseModal} style={styles.closeBtn}>
              <Icon name="x" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Ticket Details</Text>
            <View style={{ width: 24 }} /> 
          </View>

          <ScrollView contentContainerStyle={styles.modalScroll} keyboardShouldPersistTaps="handled">
            
            {/* Ticket Info Summary */}
            <View style={styles.infoBox}>
              <Text style={styles.infoTitle}>{selectedTicket?.id} - {selectedTicket?.title}</Text>
              <Text style={styles.infoLocation}><Icon name="map-pin" size={12} /> {selectedTicket?.location}</Text>
            </View>

            {/* 1. Image Upload Section (4 Max) */}
            <Text style={styles.sectionTitle}>Attach Proof (Max 4)</Text>
            <View style={styles.imageGrid}>
              {[0, 1, 2, 3].map((index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.imageSlot}
                  onPress={handleMockImageUpload}
                  activeOpacity={0.7}
                >
                  {images[index] ? (
                    <Image source={{ uri: images[index] }} style={styles.uploadedImage} />
                  ) : (
                    <Icon name="camera" size={24} color={colors.textMuted} />
                  )}
                </TouchableOpacity>
              ))}
            </View>

            {/* 2. Checklist Section */}
            <Text style={styles.sectionTitle}>Task Checklist</Text>
            <View style={styles.checklistContainer}>
              {CHECKLIST_ITEMS.map((item) => {
                const isChecked = selectedChecks.includes(item.id);
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[styles.checkItem, isChecked && styles.checkItemActive]}
                    onPress={() => toggleChecklist(item.id)}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.checkBox, isChecked && styles.checkBoxActive]}>
                      {isChecked && <Icon name="check" size={14} color="#FFFFFF" />}
                    </View>
                    <Text style={[styles.checkText, isChecked && styles.checkTextActive]}>
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* 3. Description Input */}
            <Text style={styles.sectionTitle}>Resolution Description</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Describe the work done or current status..."
              placeholderTextColor={colors.textMuted}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              value={description}
              onChangeText={setDescription}
            />

          </ScrollView>

          {/* Modal Footer */}
          <View style={[styles.modalFooter, { paddingBottom: Math.max(insets.bottom, spacing.md) }]}>
            <ButtonPrimary title="Submit Report" onPress={handleSubmitReport} />
          </View>

        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};


export const MemberDashboardScreen = withRoleGuard(DashboardComponent, ['member']);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' }, // Strict pure white
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  greeting: { ...typography.screenTitle, fontSize: 28, marginBottom: spacing.none },
  subtitle: { ...typography.bodyLarge, color: colors.textMuted },
  avatarPlaceholder: {
    width: 48,
    height: 48,
    borderRadius: radius.full,
    backgroundColor: colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: { ...typography.heading, color: colors.primary, fontSize: 20 },
  
  // Ticket List
  scrollContent: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xxxl },
  ticketCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.card,
  },
  ticketHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.sm },
  ticketId: { ...typography.caption, color: colors.textMuted, fontWeight: '700' },
  statusBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: radius.full },
  statusDot: { width: 6, height: 6, borderRadius: 3, marginRight: 4 },
  statusText: { ...typography.caption, fontWeight: '600', fontSize: 10, textTransform: 'uppercase' },
  ticketTitle: { ...typography.heading, fontSize: 18, marginBottom: spacing.md },
  ticketFooter: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: colors.divider, paddingTop: spacing.sm, gap: spacing.lg },
  footerItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  footerText: { ...typography.caption, color: colors.textSecondary },

  // Modal Styles
  modalContainer: { flex: 1, backgroundColor: '#FFFFFF' },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },
  closeBtn: { padding: spacing.xs },
  modalTitle: { ...typography.heading, fontSize: 18 },
  modalScroll: { padding: spacing.lg, paddingBottom: spacing.xxxl },
  
  infoBox: { backgroundColor: '#F7F7F9', padding: spacing.md, borderRadius: radius.md, marginBottom: spacing.xl },
  infoTitle: { ...typography.bodyLarge, fontWeight: '700', marginBottom: spacing.xs },
  infoLocation: { ...typography.caption, color: colors.textSecondary },

  sectionTitle: { ...typography.bodyLarge, fontWeight: '700', marginBottom: spacing.md, color: colors.textPrimary },
  
  // Image Grid
  imageGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.xl },
  imageSlot: {
    width: '23%',
    aspectRatio: 1,
    backgroundColor: '#F7F7F9',
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  uploadedImage: { width: '100%', height: '100%' },

  // Checklist
  checklistContainer: { marginBottom: spacing.xl, gap: spacing.sm },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: '#FFFFFF',
  },
  checkItemActive: { borderColor: colors.primary, backgroundColor: colors.primaryLight + '50' },
  checkBox: {
    width: 22,
    height: 22,
    borderRadius: radius.sm,
    borderWidth: 2,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  checkBoxActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  checkText: { ...typography.body, color: colors.textSecondary },
  checkTextActive: { color: colors.textPrimary, fontWeight: '600' },

  // Text Area
  textArea: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    ...typography.body,
    color: colors.textPrimary,
    backgroundColor: '#FFFFFF',
    minHeight: 120,
    marginBottom: spacing.xl,
  },

  modalFooter: { padding: spacing.lg, borderTopWidth: 1, borderTopColor: colors.divider, backgroundColor: '#FFFFFF' },
});