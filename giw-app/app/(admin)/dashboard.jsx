import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

const { width: screenWidth } = Dimensions.get("window");

// ─── Design Tokens ────────────────────────────────────────────────
const COLORS = {
  primary: "#1E3A8A",
  primaryLight: "#3B6FD4",
  accent: "#60A5FA",
  surface: "#FFFFFF",
  background: "#f8f9fa",
  text: "#1e293b",
  textSecondary: "#64748b",
  border: "#e2e8f0",
  success: "#10b981",
  warning: "#f59e0b",
  error: "#ef4444",
  info: "#3b82f6",
};

// ─── Stat Card Component ───────────────────────────────────────────
const StatCard = ({ title, value, icon, color, trend, onPress }) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.statCard,
        pressed && styles.statCardPressed,
      ]}
    >
      <LinearGradient
        colors={[color, color + "CC"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.statIconContainer}
      >
        <MaterialIcons name={icon} size={28} color="#fff" />
      </LinearGradient>
      <View style={styles.statInfo}>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statTitle}>{title}</Text>
        {trend && (
          <View
            style={[
              styles.trendContainer,
              { backgroundColor: trend.color + "20" },
            ]}
          >
            <MaterialIcons
              name={trend.up ? "trending-up" : "trending-down"}
              size={14}
              color={trend.color}
            />
            <Text style={[styles.trendText, { color: trend.color }]}>
              {trend.value}
            </Text>
          </View>
        )}
      </View>
    </Pressable>
  );
};

// ─── Quick Action Button ───────────────────────────────────────────
const QuickAction = ({ icon, label, color, onPress }) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.quickAction,
        pressed && styles.quickActionPressed,
      ]}
    >
      <View style={[styles.quickActionIcon, { backgroundColor: color + "15" }]}>
        <MaterialIcons name={icon} size={24} color={color} />
      </View>
      <Text style={styles.quickActionLabel}>{label}</Text>
    </Pressable>
  );
};

// ─── Recent Activity Item ───────────────────────────────────────────
const ActivityItem = ({ icon, title, subtitle, time, color }) => {
  return (
    <View style={styles.activityItem}>
      <View style={[styles.activityIcon, { backgroundColor: color + "15" }]}>
        <MaterialIcons name={icon} size={20} color={color} />
      </View>
      <View style={styles.activityInfo}>
        <Text style={styles.activityTitle}>{title}</Text>
        <Text style={styles.activitySubtitle}>{subtitle}</Text>
      </View>
      <Text style={styles.activityTime}>{time}</Text>
    </View>
  );
};

// ─── Main Dashboard Component ──────────────────────────────────────
const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Simulate data fetching
    const fetchData = async () => {
      setTimeout(() => {
        setStats({
          totalUsers: 1248,
          totalProducts: 356,
          totalOrders: 892,
          revenue: "$45,230",
          userTrend: { up: true, value: "+12%", color: COLORS.success },
          productTrend: { up: true, value: "+5%", color: COLORS.success },
          orderTrend: { up: true, value: "+18%", color: COLORS.success },
          revenueTrend: { up: true, value: "+24%", color: COLORS.success },
        });
        setLoading(false);
      }, 800);
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading dashboard...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Admin Panel</Text>
          <Text style={styles.subtitle}>Welcome back, Administrator</Text>
        </View>
        <Pressable style={styles.notificationButton}>
          <MaterialIcons name="notifications" size={24} color={COLORS.text} />
          <View style={styles.notificationBadge} />
        </Pressable>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        <StatCard
          title="Total Users"
          value={stats.totalUsers.toLocaleString()}
          icon="people"
          color={COLORS.primary}
          trend={stats.userTrend}
          onPress={() => router.push("/(admin)/users")}
        />
        <StatCard
          title="Revenue"
          value={stats.revenue}
          icon="attach-money"
          color={COLORS.warning}
          trend={stats.revenueTrend}
          onPress={() => {}}
        />
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsGrid}>
          <QuickAction
            icon="person-add"
            label="Add User"
            color={COLORS.primary}
            onPress={() => router.push("/(admin)/users")}
          />
          <QuickAction
            icon="settings"
            label="Settings"
            color={COLORS.info}
            onPress={() => {}}
          />
        </View>
      </View>

      {/* Recent Activity */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <Pressable>
            <Text style={styles.seeAll}>See All</Text>
          </Pressable>
        </View>
        <View style={styles.activityList}>
          <ActivityItem
            icon="person-add"
            title="New user registered"
            subtitle="John Doe joined as a customer"
            time="2m ago"
            color={COLORS.success}
          />
          <ActivityItem
            icon="shopping-cart"
            title="New order received"
            subtitle="Order #1234 - $1,250"
            time="15m ago"
            color={COLORS.primary}
          />
          <ActivityItem
            icon="star"
            title="New review posted"
            subtitle="5-star review on Diamond Ring"
            time="1h ago"
            color={COLORS.warning}
          />
          <ActivityItem
            icon="inventory"
            title="Product updated"
            subtitle="Stock updated for Gold Necklace"
            time="2h ago"
            color={COLORS.info}
          />
        </View>
      </View>

      {/* Bottom padding */}
      <View style={{ height: 100 }} />
    </ScrollView>
  );
};

// ─── Styles ────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  greeting: {
    fontSize: 28,
    fontWeight: "800",
    color: COLORS.primary,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  notificationBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.error,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    width: (screenWidth - 56) / 2,
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  statCardPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.98 }],
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  statInfo: {
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "800",
    color: COLORS.text,
  },
  statTitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  trendContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginTop: 4,
    alignSelf: "flex-start",
  },
  trendText: {
    fontSize: 11,
    fontWeight: "600",
    marginLeft: 2,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
  },
  seeAll: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: "600",
  },
  quickActionsGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  quickAction: {
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
    minWidth: 70,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  quickActionPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.95 }],
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  quickActionLabel: {
    fontSize: 12,
    color: COLORS.text,
    fontWeight: "500",
  },
  activityList: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
  },
  activitySubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  activityTime: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
});

export default Dashboard;
