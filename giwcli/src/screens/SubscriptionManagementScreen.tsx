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
  Switch,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import api from '../utils/api';
import Toast from 'react-native-toast-message';

interface Subscription {
  id: string;
  name: string;
  durationMonth: number;
  price: number;
  stockLimit: number;
  hasDiamonds: boolean;
  hasJewellery: boolean;
  description: string;
  isActive: boolean;
}

const SubscriptionManagementScreen: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [buyers, setBuyers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    id: '',
    name: '',
    durationMonth: '',
    price: '',
    stockLimit: '',
    hasDiamonds: false,
    hasJewellery: false,
    description: '',
    isActive: true,
  });

  const [activeTab, setActiveTab] = useState<'plans' | 'buyers'>('plans');
  const insets = useSafeAreaInsets();

  const fetchSubscriptions = useCallback(async () => {
    try {
      const response = await api.get('/admin/subscriptions');
      if (response.data?.subscriptions) {
        setSubscriptions(response.data.subscriptions);
      }
    } catch (error: any) {
      console.error('Fetch subscriptions error:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.response?.data?.message || 'Failed to fetch subscriptions',
      });
    }
  }, []);

  const fetchBuyers = useCallback(async () => {
    try {
      const response = await api.get('/admin/subscription-buyers');
      if (response.data?.buyers) {
        setBuyers(response.data.buyers);
      }
    } catch (error: any) {
      console.error('Fetch buyers error:', error);
    }
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchSubscriptions(), fetchBuyers()]);
    setRefreshing(false);
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchSubscriptions(), fetchBuyers()]);
      setLoading(false);
    };
    loadData();
  }, [fetchSubscriptions, fetchBuyers]);

  const resetForm = () => {
    setFormData({
      id: '',
      name: '',
      durationMonth: '',
      price: '',
      stockLimit: '',
      hasDiamonds: false,
      hasJewellery: false,
      description: '',
      isActive: true,
    });
    setIsEditing(false);
  };

  const handleAddNew = () => {
    resetForm();
    setShowModal(true);
  };

  const handleEdit = (sub: Subscription) => {
    setFormData({
      id: sub.id,
      name: sub.name,
      durationMonth: sub.durationMonth.toString(),
      price: sub.price.toString(),
      stockLimit: sub.stockLimit.toString(),
      hasDiamonds: sub.hasDiamonds,
      hasJewellery: sub.hasJewellery,
      description: sub.description || '',
      isActive: sub.isActive,
    });
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await api.delete(`/admin/subscriptions/${id}`);
      if (response.data?.success) {
        Toast.show({
          type: 'success',
          text1: 'Deleted',
          text2: 'Subscription plan deleted successfully',
        });
        await fetchSubscriptions();
      }
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.response?.data?.message || 'Failed to delete',
      });
    }
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.durationMonth || !formData.price) {
      Toast.show({
        type: 'error',
        text1: 'Validation',
        text2: 'Please fill in all required fields',
      });
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        name: formData.name,
        durationMonth: parseInt(formData.durationMonth),
        price: parseFloat(formData.price),
        stockLimit: parseInt(formData.stockLimit) || 0,
        hasDiamonds: formData.hasDiamonds,
        hasJewellery: formData.hasJewellery,
        description: formData.description,
        isActive: formData.isActive,
      };

      if (isEditing && formData.id) {
        const response = await api.put(
          `/admin/subscriptions/${formData.id}`,
          payload,
        );
        if (response.data?.success) {
          Toast.show({
            type: 'success',
            text1: 'Updated',
            text2: 'Subscription plan updated successfully',
          });
        }
      } else {
        const response = await api.post('/admin/subscriptions', payload);
        if (response.data?.success) {
          Toast.show({
            type: 'success',
            text1: 'Created',
            text2: 'New subscription plan created',
          });
        }
      }

      setShowModal(false);
      resetForm();
      await fetchSubscriptions();
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error.response?.data?.message || 'Operation failed',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const filteredSubscriptions = subscriptions.filter(sub =>
    sub.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const getBuyersCountForPlan = (planId: string) => {
    return buyers.filter(
      buyer =>
        buyer.planId === planId && buyer.status?.toLowerCase() !== 'cancelled',
    ).length;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Subscription Management</Text>
        <Text style={styles.headerSubtitle}>Manage plans and subscribers</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <Pressable
          style={[styles.tab, activeTab === 'plans' && styles.tabActive]}
          onPress={() => setActiveTab('plans')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'plans' && styles.tabTextActive,
            ]}
          >
            Plans ({subscriptions.length})
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tab, activeTab === 'buyers' && styles.tabActive]}
          onPress={() => setActiveTab('buyers')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'buyers' && styles.tabTextActive,
            ]}
          >
            Subscribers ({buyers.length})
          </Text>
        </Pressable>
      </View>

      {/* Search / Add Button */}
      {activeTab === 'plans' && (
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search plans..."
            value={searchTerm}
            onChangeText={setSearchTerm}
            placeholderTextColor="#94A3B8"
          />
          <Pressable style={styles.addButton} onPress={handleAddNew}>
            <MaterialIcons name="add" size={28} color="#FFFFFF" />
          </Pressable>
        </View>
      )}

      {/* Content */}
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
        ) : activeTab === 'plans' ? (
          filteredSubscriptions.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No subscription plans found</Text>
            </View>
          ) : (
            <View style={styles.plansList}>
              {filteredSubscriptions.map(sub => (
                <View key={sub.id} style={styles.planCard}>
                  <View style={styles.planHeader}>
                    <View style={styles.planIcon}>
                      <MaterialIcons
                        name="card-membership"
                        size={28}
                        color="#1D4ED8"
                      />
                    </View>
                    <View style={styles.planInfo}>
                      <Text style={styles.planName}>{sub.name}</Text>
                      <Text style={styles.planDuration}>
                        {sub.durationMonth} months
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.statusBadge,
                        sub.isActive
                          ? styles.activeBadge
                          : styles.inactiveBadge,
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusText,
                          sub.isActive
                            ? styles.activeText
                            : styles.inactiveText,
                        ]}
                      >
                        {sub.isActive ? 'Active' : 'Inactive'}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.planDetails}>
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Price</Text>
                      <Text style={styles.detailValue}>${sub.price}</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Stock Limit</Text>
                      <Text style={styles.detailValue}>{sub.stockLimit}</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Buyers</Text>
                      <Text style={styles.detailValue}>
                        {getBuyersCountForPlan(sub.id)}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.planFeatures}>
                    {sub.hasDiamonds && (
                      <View style={styles.featureBadge}>
                        <MaterialIcons
                          name="diamond"
                          size={14}
                          color="#1D4ED8"
                        />
                        <Text style={styles.featureText}> Diamonds</Text>
                      </View>
                    )}
                    {sub.hasJewellery && (
                      <View style={styles.featureBadge}>
                        <MaterialIcons name="watch" size={14} color="#8B5CF6" />
                        <Text style={styles.featureText}> Jewelry</Text>
                      </View>
                    )}
                  </View>

                  <View style={styles.planActions}>
                    <Pressable
                      style={styles.editButton}
                      onPress={() => handleEdit(sub)}
                    >
                      <Text style={styles.editButtonText}>Edit</Text>
                    </Pressable>
                    <Pressable
                      style={styles.deleteButton}
                      onPress={() => handleDelete(sub.id)}
                    >
                      <Text style={styles.deleteButtonText}>Delete</Text>
                    </Pressable>
                  </View>
                </View>
              ))}
            </View>
          )
        ) : buyers.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No subscribers found</Text>
          </View>
        ) : (
          <View style={styles.buyersList}>
            {buyers.map((buyer, index) => (
              <View key={index} style={styles.buyerCard}>
                <View style={styles.buyerHeader}>
                  <View style={styles.buyerAvatar}>
                    <Text style={styles.buyerAvatarText}>
                      {buyer.userName?.charAt(0).toUpperCase() || 'U'}
                    </Text>
                  </View>
                  <View style={styles.buyerInfo}>
                    <Text style={styles.buyerName}>{buyer.userName}</Text>
                    <Text style={styles.buyerCompany}>{buyer.userCompany}</Text>
                  </View>
                </View>
                <View style={styles.buyerDetails}>
                  <View style={styles.buyerPlanRow}>
                    <MaterialIcons
                      name="card-membership"
                      size={16}
                      color="#1D4ED8"
                    />
                    <Text style={styles.buyerPlan}>{buyer.planName}</Text>
                  </View>
                  <View style={styles.buyerExpiryRow}>
                    <MaterialIcons name="schedule" size={14} color="#64748B" />
                    <Text style={styles.buyerExpiry}>
                      Expires: {new Date(buyer.planExpiry).toLocaleDateString()}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.buyerStatus,
                      buyer.status?.toLowerCase() === 'active'
                        ? styles.statusActive
                        : styles.statusInactive,
                    ]}
                  >
                    <Text style={styles.buyerStatusText}>{buyer.status}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Add/Edit Modal */}
      <Modal
        visible={showModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {isEditing ? 'Edit Plan' : 'New Subscription Plan'}
              </Text>
              <Pressable onPress={() => setShowModal(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </Pressable>
            </View>

            <ScrollView style={styles.modalBody}>
              <Text style={styles.inputLabel}>Plan Name *</Text>
              <TextInput
                style={styles.input}
                value={formData.name}
                onChangeText={text => setFormData({ ...formData, name: text })}
                placeholder="e.g., Premium Plan"
                placeholderTextColor="#94A3B8"
              />

              <View style={styles.rowInputs}>
                <View style={styles.halfInput}>
                  <Text style={styles.inputLabel}>Duration (months) *</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.durationMonth}
                    onChangeText={text =>
                      setFormData({ ...formData, durationMonth: text })
                    }
                    placeholder="12"
                    keyboardType="numeric"
                    placeholderTextColor="#94A3B8"
                  />
                </View>
                <View style={styles.halfInput}>
                  <Text style={styles.inputLabel}>Price ($) *</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.price}
                    onChangeText={text =>
                      setFormData({ ...formData, price: text })
                    }
                    placeholder="99.99"
                    keyboardType="decimal-pad"
                    placeholderTextColor="#94A3B8"
                  />
                </View>
              </View>

              <Text style={styles.inputLabel}>Stock Limit</Text>
              <TextInput
                style={styles.input}
                value={formData.stockLimit}
                onChangeText={text =>
                  setFormData({ ...formData, stockLimit: text })
                }
                placeholder="1000"
                keyboardType="numeric"
                placeholderTextColor="#94A3B8"
              />

              <View style={styles.switchesContainer}>
                <View style={styles.switchRow}>
                  <Text style={styles.switchLabel}>Diamonds</Text>
                  <Switch
                    value={formData.hasDiamonds}
                    onValueChange={value =>
                      setFormData({ ...formData, hasDiamonds: value })
                    }
                    trackColor={{ false: '#CBD5E1', true: '#93C5FD' }}
                    thumbColor={formData.hasDiamonds ? '#1D4ED8' : '#64748B'}
                  />
                </View>
                <View style={styles.switchRow}>
                  <Text style={styles.switchLabel}>Jewelry</Text>
                  <Switch
                    value={formData.hasJewellery}
                    onValueChange={value =>
                      setFormData({ ...formData, hasJewellery: value })
                    }
                    trackColor={{ false: '#CBD5E1', true: '#93C5FD' }}
                    thumbColor={formData.hasJewellery ? '#1D4ED8' : '#64748B'}
                  />
                </View>
                <View style={styles.switchRow}>
                  <Text style={styles.switchLabel}>Active</Text>
                  <Switch
                    value={formData.isActive}
                    onValueChange={value =>
                      setFormData({ ...formData, isActive: value })
                    }
                    trackColor={{ false: '#CBD5E1', true: '#93C5FD' }}
                    thumbColor={formData.isActive ? '#1D4ED8' : '#64748B'}
                  />
                </View>
              </View>

              <Text style={styles.inputLabel}>Description</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.description}
                onChangeText={text =>
                  setFormData({ ...formData, description: text })
                }
                placeholder="Plan description..."
                multiline
                numberOfLines={4}
                placeholderTextColor="#94A3B8"
              />

              <Pressable
                style={[
                  styles.submitButton,
                  submitting && styles.submitButtonDisabled,
                ]}
                onPress={handleSubmit}
                disabled={submitting}
              >
                {submitting ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.submitButtonText}>
                    {isEditing ? 'Update Plan' : 'Create Plan'}
                  </Text>
                )}
              </Pressable>
            </ScrollView>
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
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    gap: 12,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: '#1D4ED8',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    height: 48,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#0F172A',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#1D4ED8',
    justifyContent: 'center',
    alignItems: 'center',
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
  plansList: {
    padding: 16,
  },
  planCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#1E293B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  planIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#DBEAFE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  planInfo: {
    flex: 1,
    marginLeft: 12,
  },
  planName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
  },
  planDuration: {
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
  planDetails: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: '#94A3B8',
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
    marginTop: 2,
  },
  planFeatures: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  featureBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
  },
  featureText: {
    fontSize: 12,
    color: '#475569',
    marginLeft: 4,
  },
  planActions: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
  },
  editButtonText: {
    color: '#1D4ED8',
    fontSize: 14,
    fontWeight: '600',
  },
  deleteButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#DC2626',
    fontSize: 14,
    fontWeight: '600',
  },
  buyersList: {
    padding: 16,
  },
  buyerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#1E293B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  buyerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  buyerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1D4ED8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buyerAvatarText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  buyerInfo: {
    flex: 1,
    marginLeft: 12,
  },
  buyerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A',
  },
  buyerCompany: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
  },
  buyerDetails: {
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 12,
  },
  buyerPlanRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  buyerPlan: {
    fontSize: 14,
    color: '#1D4ED8',
    fontWeight: '500',
    marginLeft: 6,
  },
  buyerExpiryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  buyerExpiry: {
    fontSize: 13,
    color: '#64748B',
    marginLeft: 6,
  },
  buyerStatus: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusActive: {
    backgroundColor: '#D1FAE5',
  },
  statusInactive: {
    backgroundColor: '#FEE2E2',
  },
  buyerStatusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#059669',
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
    maxHeight: '85%',
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
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    height: 48,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#0F172A',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  rowInputs: {
    flexDirection: 'row',
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  switchesContainer: {
    marginTop: 8,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  switchLabel: {
    fontSize: 16,
    color: '#0F172A',
  },
  submitButton: {
    backgroundColor: '#1D4ED8',
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 24,
    marginBottom: 12,
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

export default SubscriptionManagementScreen;
