import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  TextInput,
  ActivityIndicator,
  Alert,
  Animated,
  Switch,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import Toast from "react-native-toast-message";
import { secureStorage } from "../../src/utils/secureStorage.js";
import { authAPI } from "../../src/api/api.js";

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
};

// ─── Animated Components ─────────────────────────────────────────
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// ─── Input Field Component ────────────────────────────────────────
const ProfileInput = ({
  label,
  value,
  onChangeText,
  editable,
  icon,
  keyboardType = "default",
  multiline = false,
}) => {
  return (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View
        style={[
          styles.inputWrapper,
          !editable && styles.inputDisabled,
          multiline && styles.inputMultiline,
        ]}
      >
        <MaterialIcons
          name={icon}
          size={20}
          color={COLORS.textSecondary}
          style={styles.inputIcon}
        />
        <TextInput
          style={[styles.input, multiline && styles.multilineInput]}
          value={value}
          onChangeText={onChangeText}
          editable={editable}
          keyboardType={keyboardType}
          multiline={multiline}
          numberOfLines={multiline ? 3 : 1}
          placeholderTextColor={COLORS.textSecondary}
        />
        {!editable && (
          <MaterialIcons
            name="lock"
            size={16}
            color={COLORS.textSecondary}
            style={styles.lockIcon}
          />
        )}
      </View>
    </View>
  );
};

// ─── Settings Item Component ─────────────────────────────────────
const SettingsItem = ({
  icon,
  title,
  subtitle,
  value,
  onValueChange,
  type = "toggle",
}) => {
  return (
    <View style={styles.settingsItem}>
      <View style={styles.settingsIconContainer}>
        <MaterialIcons name={icon} size={22} color={COLORS.primary} />
      </View>
      <View style={styles.settingsContent}>
        <Text style={styles.settingsTitle}>{title}</Text>
        {subtitle && <Text style={styles.settingsSubtitle}>{subtitle}</Text>}
      </View>
      {type === "toggle" ? (
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: COLORS.border, true: COLORS.primary + "80" }}
          thumbColor={value ? COLORS.primary : "#f4f3f4"}
        />
      ) : (
        <MaterialIcons
          name="chevron-right"
          size={24}
          color={COLORS.textSecondary}
        />
      )}
    </View>
  );
};

// ─── Main Profile Component ─────────────────────────────────────
const Profile = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  // Animation values
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(30))[0];

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    address: "",
    gst: "",
  });

  const [settings, setSettings] = useState({
    notifications: true,
    biometricLogin: false,
  });

  // Load user data
  useEffect(() => {
    const loadUserData = async () => {
      try {
        setLoading(true);
        const userData = await secureStorage.getUserData();
        const token = await secureStorage.getToken();

        if (userData) {
          setUser(userData);
          // Animate in content
          Animated.parallel([
            Animated.timing(fadeAnim, {
              toValue: 1,
              duration: 400,
              useNativeDriver: true,
            }),
            Animated.timing(slideAnim, {
              toValue: 0,
              duration: 400,
              useNativeDriver: true,
            }),
          ]).start();
        } else if (!token) {
          // User not logged in - redirect to login
          setTimeout(() => {
            router.replace("/(auth)/login");
          }, 1000);
        }
      } catch (error) {
        console.error("Error loading user data:", error);
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Failed to load profile data",
        });
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  // Update form data when user changes
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        company: user.company || "",
        phone: user.phone || "",
        address: user.address || "",
        gst: user.gst || "",
      });
    }
  }, [user]);

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogout = useCallback(async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            try {
              await secureStorage.clearAll();
              Toast.show({
                type: "success",
                text1: "Logged Out",
                text2: "You have been successfully logged out",
              });
              router.replace("/(auth)/login");
            } catch (error) {
              console.error("Logout error:", error);
              Toast.show({
                type: "error",
                text1: "Logout Failed",
                text2: "Unable to logout. Please try again",
              });
            }
          },
        },
      ],
      { cancelable: true },
    );
  }, [router]);

  const handleEdit = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsEditing(true);
  };

  const handleCancel = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsEditing(false);
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        company: user.company || "",
        phone: user.phone || "",
        address: user.address || "",
        gst: user.gst || "",
      });
    }
  };

  const handleSave = async () => {
    setSaveLoading(true);

    try {
      const token = await secureStorage.getToken();

      if (!token) {
        throw new Error("Authentication required. Please login again.");
      }

      const response = await authAPI.updateProfile(
        {
          name: formData.name.trim(),
          company: formData.company.trim(),
          phone: formData.phone,
          address: formData.address.trim(),
          gst: formData.gst,
        },
        token,
      );

      if (response.success) {
        setUser(response.user);
        await secureStorage.setUserData(response.user);
        await secureStorage.setRole(response.user.role || "admin");
        setIsEditing(false);
        Toast.show({
          type: "success",
          text1: "Profile Updated",
          text2: "Your changes have been saved successfully",
        });
      } else {
        throw new Error(response.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Profile update error:", error);
      Toast.show({
        type: "error",
        text1: "Update Failed",
        text2: error.message || "Unable to update profile",
      });
    } finally {
      setSaveLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  const avatar =
    user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "A";

  return (
    <View style={[styles.container, { paddingTop: insets.top + 16 }]}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Admin Profile</Text>
          <Text style={styles.subtitle}>Manage your account settings</Text>
        </View>
        <Pressable style={styles.logoutButton} onPress={handleLogout}>
          <MaterialIcons name="logout" size={20} color={COLORS.error} />
        </Pressable>
      </View>

      {/* Avatar Card */}
      <Animated.View
        style={[
          styles.avatarCard,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
        ]}
      >
        <LinearGradient
          colors={[COLORS.primary, COLORS.primaryLight]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.avatarGradient}
        >
          <View style={styles.avatarRing}>
            <Text style={styles.avatarTextLarge}>{avatar}</Text>
          </View>
          <Text style={styles.avatarName}>{user?.name || "Administrator"}</Text>
          <View style={styles.roleBadge}>
            <MaterialIcons name="verified-user" size={14} color="#fff" />
            <Text style={styles.roleText}>Admin</Text>
          </View>
        </LinearGradient>
      </Animated.View>

      {/* Tab Switcher */}
      <View style={styles.tabContainer}>
        <Pressable
          style={[styles.tab, activeTab === "profile" && styles.tabActive]}
          onPress={() => setActiveTab("profile")}
        >
          <MaterialIcons
            name="person"
            size={18}
            color={
              activeTab === "profile" ? COLORS.primary : COLORS.textSecondary
            }
          />
          <Text
            style={[
              styles.tabText,
              activeTab === "profile" && styles.tabTextActive,
            ]}
          >
            Profile
          </Text>
        </Pressable>
        <Pressable
          style={[styles.tab, activeTab === "settings" && styles.tabActive]}
          onPress={() => setActiveTab("settings")}
        >
          <MaterialIcons
            name="settings"
            size={18}
            color={
              activeTab === "settings" ? COLORS.primary : COLORS.textSecondary
            }
          />
          <Text
            style={[
              styles.tabText,
              activeTab === "settings" && styles.tabTextActive,
            ]}
          >
            Settings
          </Text>
        </Pressable>
      </View>

      {/* Content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {activeTab === "profile" ? (
          <View style={styles.formCard}>
            {/* Edit Actions */}
            <View style={styles.editActions}>
              {!isEditing ? (
                <Pressable style={styles.editButton} onPress={handleEdit}>
                  <MaterialIcons name="edit" size={18} color={COLORS.primary} />
                  <Text style={styles.editButtonText}>Edit Profile</Text>
                </Pressable>
              ) : (
                <View style={styles.editButtonsRow}>
                  <Pressable style={styles.cancelButton} onPress={handleCancel}>
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </Pressable>
                  <Pressable
                    style={[
                      styles.saveButton,
                      saveLoading && styles.buttonDisabled,
                    ]}
                    onPress={handleSave}
                    disabled={saveLoading}
                  >
                    {saveLoading ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <>
                        <MaterialIcons name="save" size={18} color="#fff" />
                        <Text style={styles.saveButtonText}>Save</Text>
                      </>
                    )}
                  </Pressable>
                </View>
              )}
            </View>

            <ProfileInput
              label="Full Name"
              value={formData.name}
              onChangeText={(v) => handleInputChange("name", v)}
              editable={isEditing}
              icon="person"
            />
            <ProfileInput
              label="Email Address"
              value={formData.email}
              onChangeText={(v) => handleInputChange("email", v)}
              editable={false}
              icon="email"
              keyboardType="email-address"
            />
            <ProfileInput
              label="Company"
              value={formData.company}
              onChangeText={(v) => handleInputChange("company", v)}
              editable={isEditing}
              icon="business"
            />
            <ProfileInput
              label="Phone Number"
              value={formData.phone}
              onChangeText={(v) => handleInputChange("phone", v)}
              editable={isEditing}
              icon="phone"
              keyboardType="phone-pad"
            />
            <ProfileInput
              label="Address"
              value={formData.address}
              onChangeText={(v) => handleInputChange("address", v)}
              editable={isEditing}
              icon="location-on"
              multiline
            />
            <ProfileInput
              label="GST Number"
              value={formData.gst}
              onChangeText={(v) => handleInputChange("gst", v)}
              editable={isEditing}
              icon="receipt"
            />
          </View>
        ) : (
          <View style={styles.settingsCard}>
            <Text style={styles.settingsSectionTitle}>Notifications</Text>
            <SettingsItem
              icon="notifications"
              title="Push Notifications"
              subtitle="Receive alerts for new users and orders"
              value={settings.notifications}
              onValueChange={(v) =>
                setSettings((s) => ({ ...s, notifications: v }))
              }
            />

            <Text style={[styles.settingsSectionTitle, { marginTop: 24 }]}>
              Security
            </Text>
            <SettingsItem
              icon="fingerprint"
              title="Biometric Login"
              subtitle="Use fingerprint or face recognition"
              value={settings.biometricLogin}
              onValueChange={(v) =>
                setSettings((s) => ({ ...s, biometricLogin: v }))
              }
            />

            <Text style={[styles.settingsSectionTitle, { marginTop: 24 }]}>
              Account
            </Text>
            <Pressable style={styles.dangerButton} onPress={handleLogout}>
              <MaterialIcons name="logout" size={20} color={COLORS.error} />
              <Text style={styles.dangerButtonText}>Logout</Text>
            </Pressable>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
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
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: COLORS.primary,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  logoutButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  avatarCard: {
    marginHorizontal: 20,
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 20,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  avatarGradient: {
    paddingVertical: 32,
    alignItems: "center",
  },
  avatarRing: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.5)",
  },
  avatarTextLarge: {
    fontSize: 36,
    fontWeight: "800",
    color: "#fff",
  },
  avatarName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
    marginTop: 16,
  },
  roleBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 8,
  },
  roleText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#fff",
  },
  tabContainer: {
    flexDirection: "row",
    marginHorizontal: 20,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: 8,
  },
  tabActive: {
    backgroundColor: COLORS.primary + "15",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },
  tabTextActive: {
    color: COLORS.primary,
  },
  content: {
    paddingHorizontal: 20,
  },
  formCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 20,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  editActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 20,
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: COLORS.primary + "15",
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.primary,
  },
  editButtonsRow: {
    flexDirection: "row",
    gap: 12,
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: COLORS.background,
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },
  saveButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.textSecondary,
    marginBottom: 8,
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.background,
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  inputDisabled: {
    backgroundColor: COLORS.background,
    opacity: 0.7,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 15,
    color: COLORS.text,
  },
  inputMultiline: {
    height: 80,
    alignItems: "flex-start",
    paddingVertical: 12,
  },
  multilineInput: {
    height: 60,
    textAlignVertical: "top",
  },
  lockIcon: {
    marginLeft: 8,
  },
  settingsCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 20,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  settingsSectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: COLORS.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  settingsItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  settingsIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: COLORS.primary + "15",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  settingsContent: {
    flex: 1,
  },
  settingsTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.text,
  },
  settingsSubtitle: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  dangerButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: COLORS.error + "15",
    justifyContent: "center",
    marginTop: 8,
  },
  dangerButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.error,
  },
});

export default Profile;
