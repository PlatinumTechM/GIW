import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  ActivityIndicator,
  Modal,
  StatusBar,
  RefreshControl,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import api from '../utils/api';
import Toast from 'react-native-toast-message';
import { useAuth } from '../context/AuthContext';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  role: string;
  isActive: boolean;
  planName: string | null;
  planExpiry: string | null;
  createdAt: string;
  stockCount: number;
}

const UserManagementScreen: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState('');
  const [selectedDuration, setSelectedDuration] = useState(1);
  const [updatingPlan, setUpdatingPlan] = useState(false);
  const insets = useSafeAreaInsets();
  const { user: currentUser } = useAuth();

  const fetchUsers = useCallback(async (search = '') => {
    try {
      const params = search ? { params: { search } } : {};
      const response = await api.get('/admin/users', params);
      if (response.data?.users) {
        setUsers(response.data.users);
      }
    } catch (error: any) {
      console.error('Fetch users error:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.response?.data?.message || 'Failed to fetch users',
      });
    }
  }, []);

  const fetchSubscriptions = async () => {
    try {
      const response = await api.get('/admin/subscriptions');
      if (response.data?.subscriptions) {
        setSubscriptions(
          response.data.subscriptions.filter((s: any) => s.isActive),
        );
      }
    } catch (error) {
      console.error('Fetch subscriptions error:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchUsers(searchTerm);
    setRefreshing(false);
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchUsers();
      setLoading(false);
    };
    loadData();
  }, [fetchUsers]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, fetchUsers]);

  const handleUserPress = (user: User) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const handleUpdatePlan = async () => {
    if (!selectedUser) return;
    await fetchSubscriptions();
    setSelectedPlanId(selectedUser.planName || '');
    setSelectedDuration(1);
    setShowPlanModal(true);
    setShowUserModal(false);
  };

  const handlePlanUpdateSubmit = async () => {
    if (!selectedUser) return;
    try {
      setUpdatingPlan(true);
      const response = await api.post(`/admin/users/${selectedUser.id}/plan`, {
        planId: selectedPlanId || null,
        duration: selectedDuration,
      });

      if (response.data?.success) {
        Toast.show({
          type: 'success',
          text1: 'Plan Updated',
          text2: 'User plan has been updated successfully',
        });
        setShowPlanModal(false);
        await fetchUsers(searchTerm);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: response.data?.message || 'Failed to update plan',
        });
      }
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.response?.data?.message || 'Failed to update plan',
      });
    } finally {
      setUpdatingPlan(false);
    }
  };

  const getInitials = (name: string) => {
    return (
      name
        ?.split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase() || 'U'
    );
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>User Management</Text>
        <Text style={styles.headerSubtitle}>Manage system users</Text>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search users..."
          value={searchTerm}
          onChangeText={setSearchTerm}
          placeholderTextColor="#94A3B8"
        />
        <MaterialIcons name="search" size={22} color="#64748B" />
      </View>

      {/* Users List */}
      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {loading ? (
          <ActivityIndicator
            size="large"
            color="#1D4ED8"
            style={styles.loader}
          />
        ) : users.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No users found</Text>
          </View>
        ) : (
          <View style={styles.usersList}>
            {users.map(user => (
              <Pressable
                key={user.id}
                style={styles.userCard}
                onPress={() => handleUserPress(user)}
              >
                <View style={styles.userHeader}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                      {getInitials(user.name)}
                    </Text>
                  </View>
                  <View style={styles.userInfo}>
                    <Text style={styles.userName}>{user.name}</Text>
                    <Text style={styles.userEmail}>{user.email}</Text>
                  </View>
                  <View
                    style={[
                      styles.statusBadge,
                      user.isActive ? styles.activeBadge : styles.inactiveBadge,
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        user.isActive ? styles.activeText : styles.inactiveText,
                      ]}
                    >
                      {user.isActive ? 'Active' : 'Inactive'}
                    </Text>
                  </View>
                </View>
                <View style={styles.userDetails}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Company:</Text>
                    <Text style={styles.detailValue}>
                      {user.company || 'N/A'}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Phone:</Text>
                    <Text style={styles.detailValue}>
                      {user.phone || 'N/A'}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Plan:</Text>
                    <Text
                      style={[
                        styles.detailValue,
                        user.planName ? styles.hasPlan : styles.noPlan,
                      ]}
                    >
                      {user.planName || 'No Plan'}
                    </Text>
                  </View>
                  {user.planName && user.planExpiry && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Expires:</Text>
                      <Text style={styles.detailValue}>
                        {formatDate(user.planExpiry)}
                      </Text>
                    </View>
                  )}
                </View>
              </Pressable>
            ))}
          </View>
        )}
      </ScrollView>

      {/* User Detail Modal */}
      <Modal
        visible={showUserModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowUserModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>User Details</Text>
              <Pressable onPress={() => setShowUserModal(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </Pressable>
            </View>
            {selectedUser && (
              <ScrollView style={styles.modalBody}>
                <View style={styles.modalAvatar}>
                  <Text style={styles.modalAvatarText}>
                    {getInitials(selectedUser.name)}
                  </Text>
                </View>
                <Text style={styles.modalUserName}>{selectedUser.name}</Text>
                <Text style={styles.modalUserEmail}>{selectedUser.email}</Text>

                <View style={styles.infoSection}>
                  <Text style={styles.infoLabel}>Company</Text>
                  <Text style={styles.infoValue}>
                    {selectedUser.company || 'N/A'}
                  </Text>
                </View>
                <View style={styles.infoSection}>
                  <Text style={styles.infoLabel}>Phone</Text>
                  <Text style={styles.infoValue}>
                    {selectedUser.phone || 'N/A'}
                  </Text>
                </View>
                <View style={styles.infoSection}>
                  <Text style={styles.infoLabel}>Role</Text>
                  <Text style={styles.infoValue}>{selectedUser.role}</Text>
                </View>
                <View style={styles.infoSection}>
                  <Text style={styles.infoLabel}>Current Plan</Text>
                  <Text
                    style={[
                      styles.infoValue,
                      selectedUser.planName ? styles.hasPlan : styles.noPlan,
                    ]}
                  >
                    {selectedUser.planName || 'No Plan'}
                  </Text>
                </View>
                {selectedUser.planName && (
                  <View style={styles.infoSection}>
                    <Text style={styles.infoLabel}>Plan Expires</Text>
                    <Text style={styles.infoValue}>
                      {formatDate(selectedUser.planExpiry)}
                    </Text>
                  </View>
                )}
                <View style={styles.infoSection}>
                  <Text style={styles.infoLabel}>Stock Count</Text>
                  <Text style={styles.infoValue}>
                    {selectedUser.stockCount || 0}
                  </Text>
                </View>

                <Pressable
                  style={styles.updatePlanButton}
                  onPress={handleUpdatePlan}
                >
                  <Text style={styles.updatePlanButtonText}>Update Plan</Text>
                </Pressable>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      {/* Update Plan Modal */}
      <Modal
        visible={showPlanModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPlanModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.planModalContent}>
            <Text style={styles.modalTitle}>Update User Plan</Text>

            <Text style={styles.inputLabel}>Select Plan</Text>
            <ScrollView style={styles.plansList}>
              <Pressable
                style={[
                  styles.planOption,
                  selectedPlanId === '' && styles.planOptionSelected,
                ]}
                onPress={() => setSelectedPlanId('')}
              >
                <Text
                  style={[
                    styles.planOptionText,
                    selectedPlanId === '' && styles.planOptionTextSelected,
                  ]}
                >
                  No Plan
                </Text>
              </Pressable>
              {subscriptions.map(sub => (
                <Pressable
                  key={sub.id}
                  style={[
                    styles.planOption,
                    selectedPlanId === sub.id && styles.planOptionSelected,
                  ]}
                  onPress={() => setSelectedPlanId(sub.id)}
                >
                  <Text
                    style={[
                      styles.planOptionText,
                      selectedPlanId === sub.id &&
                        styles.planOptionTextSelected,
                    ]}
                  >
                    {sub.name} - ${sub.price} ({sub.durationMonth} months)
                  </Text>
                </Pressable>
              ))}
            </ScrollView>

            {selectedPlanId && (
              <>
                <Text style={styles.inputLabel}>Duration</Text>
                <View style={styles.durationContainer}>
                  {[1, 3, 6, 12].map(months => (
                    <Pressable
                      key={months}
                      style={[
                        styles.durationButton,
                        selectedDuration === months &&
                          styles.durationButtonSelected,
                      ]}
                      onPress={() => setSelectedDuration(months)}
                    >
                      <Text
                        style={[
                          styles.durationText,
                          selectedDuration === months &&
                            styles.durationTextSelected,
                        ]}
                      >
                        {months} Mo
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </>
            )}

            <View style={styles.modalActions}>
              <Pressable
                style={styles.cancelButton}
                onPress={() => setShowPlanModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[
                  styles.submitButton,
                  updatingPlan && styles.submitButtonDisabled,
                ]}
                onPress={handlePlanUpdateSubmit}
                disabled={updatingPlan}
              >
                {updatingPlan ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.submitButtonText}>Update</Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0F172A',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: '#0F172A',
  },
  content: {
    flex: 1,
  },
  loader: {
    marginTop: 40,
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#94A3B8',
  },
  usersList: {
    padding: 16,
    gap: 12,
  },
  userCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#1E293B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 12,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1D4ED8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  userInfo: {
    flex: 1,
    marginLeft: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
  },
  userEmail: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  activeBadge: {
    backgroundColor: '#D1FAE5',
  },
  inactiveBadge: {
    backgroundColor: '#FEE2E2',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  activeText: {
    color: '#059669',
  },
  inactiveText: {
    color: '#DC2626',
  },
  userDetails: {
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  detailLabel: {
    fontSize: 13,
    color: '#64748B',
  },
  detailValue: {
    fontSize: 13,
    color: '#0F172A',
    fontWeight: '500',
  },
  hasPlan: {
    color: '#059669',
  },
  noPlan: {
    color: '#94A3B8',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    width: '90%',
    maxHeight: '80%',
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
  },
  closeButton: {
    fontSize: 24,
    color: '#64748B',
    padding: 4,
  },
  modalBody: {
    padding: 20,
  },
  modalAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1D4ED8',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 16,
  },
  modalAvatarText: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '700',
  },
  modalUserName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
    textAlign: 'center',
  },
  modalUserEmail: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 20,
  },
  infoSection: {
    marginBottom: 16,
  },
  infoLabel: {
    fontSize: 12,
    color: '#94A3B8',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: '#0F172A',
    fontWeight: '500',
  },
  updatePlanButton: {
    backgroundColor: '#1D4ED8',
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 20,
  },
  updatePlanButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  planModalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    width: '90%',
    padding: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 12,
    marginTop: 8,
  },
  plansList: {
    maxHeight: 200,
    marginBottom: 16,
  },
  planOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#F8FAFC',
  },
  planOptionSelected: {
    backgroundColor: '#DBEAFE',
  },
  planOptionText: {
    fontSize: 14,
    color: '#64748B',
  },
  planOptionTextSelected: {
    color: '#1D4ED8',
    fontWeight: '600',
  },
  durationContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  durationButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
  },
  durationButtonSelected: {
    backgroundColor: '#1D4ED8',
  },
  durationText: {
    fontSize: 13,
    color: '#64748B',
  },
  durationTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
  },
  cancelButtonText: {
    color: '#64748B',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  submitButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#1D4ED8',
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default UserManagementScreen;
