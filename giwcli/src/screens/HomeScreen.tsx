import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import Toast from 'react-native-toast-message';

const HomeScreen: React.FC = () => {
  const { user, logout, hasRole } = useAuth();

  const handleLogout = async () => {
    const result = await logout(true);
    if (result.success) {
      Toast.show({
        type: 'success',
        text1: 'Logged Out',
        text2: 'See you soon!',
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFF" />
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <View style={styles.logoMark}>
            <Text style={styles.logoText}>G</Text>
          </View>
          <Text style={styles.title}>Welcome, {user?.name || 'User'}!</Text>
          <Text style={styles.subtitle}>You are now logged in</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>User Information</Text>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{user?.email}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>Role:</Text>
            <Text style={styles.value}>{user?.role || 'user'}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.label}>User ID:</Text>
            <Text style={styles.value}>{user?.id}</Text>
          </View>

          {hasRole('admin') && (
            <View style={styles.adminBadge}>
              <Text style={styles.adminText}>Admin Access</Text>
            </View>
          )}
        </View>

        <View style={styles.actions}>
          <Pressable
            style={({ pressed }) => [
              styles.logoutBtn,
              pressed && styles.btnPressed,
            ]}
            onPress={handleLogout}
          >
            <Text style={styles.logoutBtnText}>Logout</Text>
          </Pressable>
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
    padding: 24,
    alignItems: 'center',
  },
  logoMark: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: '#1D4ED8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#1D4ED8',
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
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    padding: 24,
    marginHorizontal: 24,
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
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  label: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '600',
  },
  value: {
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '500',
  },
  adminBadge: {
    marginTop: 16,
    backgroundColor: '#DBEAFE',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  adminText: {
    color: '#1D4ED8',
    fontSize: 12,
    fontWeight: '700',
  },
  actions: {
    padding: 24,
  },
  logoutBtn: {
    height: 54,
    borderRadius: 17,
    backgroundColor: '#DC2626',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#DC2626',
    shadowOpacity: 0.32,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  btnPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.987 }],
  },
  logoutBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default HomeScreen;
