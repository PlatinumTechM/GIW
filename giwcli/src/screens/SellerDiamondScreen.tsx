import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  TextInput,
  StatusBar,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const SellerDiamondScreen: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'natural' | 'lab'>('natural');
  const insets = useSafeAreaInsets();

  const navigateToProfile = () => {
    console.log('Navigate to Profile');
  };

  const menuItems = [
    {
      icon: 'add-circle',
      label: 'Add Diamond',
      color: '#DBEAFE',
      textColor: '#1D4ED8',
    },
    {
      icon: 'edit',
      label: 'Add Manually',
      color: '#D1FAE5',
      textColor: '#059669',
    },
    {
      icon: 'inventory',
      label: 'My Stock',
      color: '#FEF3C7',
      textColor: '#D97706',
    },
    {
      icon: 'analytics',
      label: 'Analytics',
      color: '#E0E7FF',
      textColor: '#4F46E5',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFF" />
      <ScrollView style={styles.scrollView}>
        {/* Header with Profile */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Welcome</Text>
            <Text style={styles.headerSubtitle}>{user?.name || 'Seller'}</Text>
          </View>
          <Pressable style={styles.profileButton} onPress={navigateToProfile}>
            <MaterialIcons name="person" size={24} color="#FFFFFF" />
          </Pressable>
        </View>

        <View style={styles.logoSection}>
          <View style={[styles.logoMark, { backgroundColor: '#D97706' }]}>
            <Text style={styles.logoText}>S</Text>
          </View>
          <Text style={styles.title}>Seller Dashboard</Text>
          <Text style={styles.subtitle}>Manage your diamond stock</Text>
        </View>

        {/* Tab Switcher */}
        <View style={styles.tabContainer}>
          <Pressable
            style={[styles.tab, activeTab === 'natural' && styles.tabActive]}
            onPress={() => setActiveTab('natural')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'natural' && styles.tabTextActive,
              ]}
            >
              Natural
            </Text>
          </Pressable>
          <Pressable
            style={[styles.tab, activeTab === 'lab' && styles.tabActive]}
            onPress={() => setActiveTab('lab')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'lab' && styles.tabTextActive,
              ]}
            >
              Lab Grown
            </Text>
          </Pressable>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.menuGrid}>
            {menuItems.map((item, index) => (
              <Pressable key={index} style={styles.menuItem}>
                <View
                  style={[styles.menuIcon, { backgroundColor: item.color }]}
                >
                  <MaterialIcons
                    name={item.icon}
                    size={24}
                    color={item.textColor}
                  />
                </View>
                <Text style={styles.menuText}>{item.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Stock Summary</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>Total Diamonds</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>Available</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>Sold</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Search Stock</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by stock ID, shape, or carat..."
            placeholderTextColor="#94A3B8"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFF',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    marginTop: 8,
  },
  headerTitle: {
    fontSize: 14,
    color: '#64748B',
  },
  headerSubtitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 2,
  },
  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#D97706',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#D97706',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  logoSection: {
    padding: 24,
    paddingTop: 20,
    alignItems: 'center',
  },
  logoMark: {
    width: 60,
    height: 60,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  logoText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 28,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748B',
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 24,
    marginBottom: 16,
    backgroundColor: '#E2E8F0',
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  tabActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  tabTextActive: {
    color: '#0F172A',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 24,
    marginHorizontal: 24,
    marginBottom: 16,
    shadowColor: '#1E3A8A',
    shadowOpacity: 0.09,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 10 },
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 16,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  menuItem: {
    width: '48%',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F8FAFF',
    borderRadius: 16,
    marginBottom: 8,
  },
  menuIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  menuIconText: {
    fontSize: 24,
  },
  menuText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '600',
    textAlign: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1D4ED8',
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
  },
  searchInput: {
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: '#0F172A',
  },
});

export default SellerDiamondScreen;
